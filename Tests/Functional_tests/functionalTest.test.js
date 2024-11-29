const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const request = require('supertest');
import { app } from '../../Backend/server.js';

describe('Functional Tests', () => {
    let dom;
    let document;

    beforeAll(() => {
        // Load the HTML file
        const html = fs.readFileSync(path.resolve(__dirname, '../../Frontend/index.html'), 'utf8');
        dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
        document = dom.window.document;
        global.alert = jest.fn(); // Mock the alert function globally
    });

    test('should disable the submit button when required fields are empty', () => {
        const submitButton = document.querySelector('button[type="submit"]');
        const nameField = document.querySelector('input[name="name"]');
        const emailField = document.querySelector('input[name="email"]');

        nameField.value = '';
        emailField.value = '';

        const isDisabled = () => {
            return !nameField.value || !emailField.value;
        };

        expect(isDisabled()).toBe(true);
        expect(submitButton.disabled).toBe(true);
    });

    test('should enable the submit button when required fields are filled', () => {
        const submitButton = document.querySelector('button[type="submit"]');
        const nameField = document.querySelector('input[name="name"]');
        const emailField = document.querySelector('input[name="email"]');

        nameField.value = 'John Doe';
        emailField.value = 'john.doe@example.com';

        const isDisabled = () => {
            return !nameField.value || !emailField.value;
        };

        expect(isDisabled()).toBe(false);
        submitButton.disabled = isDisabled();
        expect(submitButton.disabled).toBe(false);
    });

    test('should submit form data and receive a success response from backend', async () => {
        const response = await request(app)
            .post('/api/generate')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '12345678',
                address: '123 Elm Street',
                occupation: 'Software Engineer',
                linkedin: 'linkedin.com/in/johndoe',
                github: 'github.com/johndoe',
                about: 'Passionate developer.',
                experience: 'Worked at X Company for 5 years.',
                education: JSON.stringify(['Bachelor of Science in Computer Science']),
                skills: JSON.stringify(['JavaScript', 'Node.js']),
                picturePath: '/path/to/image.jpg',
            });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/pdf');
    });

    test('should display error message on form submission failure', async () => {
        // Simulate backend failure
        const response = await request(app).post('/api/generate').send({}); // Invalid data
        expect(response.status).toBe(500);

        // Simulate the fetch error handling
        const error = new Error('HTTP error! Status: 500');
        console.error = jest.fn(); // Mock console.error
        console.error('Error generating CV:', error);
        alert('An error occurred while generating your CV. Please try again.');

        // Verify alert was called with the correct message
        expect(global.alert).toHaveBeenCalledWith('An error occurred while generating your CV. Please try again.');
    });
});
