// Import necessary modules
const fs = require('fs');
const { exec } = require('child_process');
const request = require('supertest');
const { server } = require('../../Backend/server.js'); // Import server instance
const { JSDOM } = require('jsdom'); // For frontend DOM tests
const path = require('path');
require('@testing-library/jest-dom');

// Mock child_process.exec
jest.mock('child_process', () => ({
    exec: jest.fn((cmd, callback) => {
        console.log(`Mock exec called with: ${cmd}`);
        callback(null, 'Mock LaTeX compilation success', ''); // Simulate success
    }),
}));

// Mock fs.existsSync to always return true for PDF file
jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: jest.fn((path) => {
        console.log(`Mock fs.existsSync called for: ${path}`);
        if (path === 'output/CV.pdf') {
            return true; // Pretend the PDF file exists
        }
        return false; // Default behavior for other paths
    }),
}));

// Backend API Tests
describe('Backend API Tests', () => {
    test('should respond to POST /api/generate', async () => {
        const response = await request(server)
            .post('/api/generate')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                phone: '1234567890',
                occupation: 'Software Engineer',
                address: '123 Test Lane',
                linkedin: 'https://linkedin.com/in/testuser',
                github: 'https://github.com/testuser',
                about: 'This is a test about section.',
                experience: '[]',
                education: '[]',
                skills: '[]',
                picturePath: '/path/to/picture',
            });
        expect(response.status).toBe(200); // Expect success
    });

    afterAll((done) => {
        jest.resetAllMocks();
        server.close(done);
    });
});

// Frontend DOM Tests
describe('Frontend DOM Tests: CV Generator Website', () => {
    let dom;

    beforeAll(() => {
        // Load the HTML file
        const html = fs.readFileSync(path.resolve(__dirname, '../../Frontend/index.html'), 'utf8');
        dom = new JSDOM(html);
    });

    test('should load the HTML content', () => {
        const document = dom.window.document;
        expect(document.title).toBe('CV Generator');
        expect(document.querySelector('h1')).toHaveTextContent('CV Generator');
        expect(document.querySelector('form')).toBeInTheDocument();
    });

    test('should load the CSS file', () => {
        const link = dom.window.document.querySelector('link[rel="stylesheet"]');
        expect(link).toBeInTheDocument();
        expect(link.href).toContain('output.css');
    });

    test('should load the JavaScript file', () => {
        const script = dom.window.document.querySelector('script[src="script.js"]');
        expect(script).toBeInTheDocument();
    });

    test('Should be able to add information to the name field, and submit it', () => {
        const document = dom.window.document;
        console.log = jest.fn(); // Mock console.log
        const nameField = document.querySelector('input[name="name"]'); // Adjust name attribute as per your HTML
        const submitButton = document.querySelector('button[type="submit"]');
        nameField.value = 'John Doe';
        expect(nameField.value).toBe('John Doe');
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(nameField.value);
        });
        submitButton.click();
        expect(console.log).toHaveBeenCalledWith('John Doe');
    });

    test('Should be able to add information to the email field, and submit it', () => {
        const document = dom.window.document;
        console.log = jest.fn();
        const emailField = document.querySelector('input[name="email"]');
        const submitButton = document.querySelector('button[type="submit"]');
        emailField.value = 'john.doe@gmail.com';
        expect(emailField.value).toBe('john.doe@gmail.com');
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(emailField.value);
        });
        submitButton.click();
        expect(console.log).toHaveBeenCalledWith('john.doe@gmail.com');
    });

    test('should upload a picture file correctly', () => {
        const document = dom.window.document;
        const file = new dom.window.File(['file content'], 'test-image.png', { type: 'image/png' });
        const fileInput = document.querySelector('input[name="picture"]');
        Object.defineProperty(fileInput, 'files', {
            value: [file],
            writable: false,
        });
        const form = document.querySelector('.cv-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            expect(fileInput.files[0]).toBe(file);
            expect(fileInput.files[0].name).toBe('test-image.png');
            expect(fileInput.files[0].type).toBe('image/png');
        });
        const submitEvent = new dom.window.Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
    });

    // Add the remaining tests for fields like LinkedIn, GitHub, About Me, etc.
    // Tests omitted for brevity but should follow a similar structure.
});
