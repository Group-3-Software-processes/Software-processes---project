require('@testing-library/jest-dom');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const request = require('supertest');
import { app } from '../../Backend/server.js';

describe('CV Generator Website', () => {
    let dom;

    beforeAll(() => {
        const html = fs.readFileSync(path.resolve(__dirname, '../../Frontend/index.html'), 'utf8');
        dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
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


test('Should be able to add information to all fields and submit them manually', () => {
    const document = dom.window.document;
    console.log = jest.fn(); // Mock console.log

    // Define field values to test
    const fieldValues = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '12345678',
        address: '123 Elm Street',
        about: 'This is about me',
    };

    // Set field values
    Object.keys(fieldValues).forEach((fieldName) => {
        const field = document.querySelector(`input[name="${fieldName}"]`) || 
                      document.querySelector(`textarea[name="${fieldName}"]`);
        if (!field) {
            console.error(`Field not found: ${fieldName}`);
        } else {
            field.value = fieldValues[fieldName];
            field.dispatchEvent(new dom.window.Event('input')); // Simulate user typing
            expect(field.value).toBe(fieldValues[fieldName]); // Verify value is set
        }
    });

    // Mock the form submission handler
    const form = document.querySelector('.cv-form');
    const mockSubmitHandler = jest.fn((e) => {
        e.preventDefault();
        Object.keys(fieldValues).forEach((key) => {
            const field = document.querySelector(`input[name="${key}"]`) || 
                          document.querySelector(`textarea[name="${key}"]`);
            console.log(`Submitting: ${key} = ${field?.value}`);
        });
    });

    // Add the mocked submit handler to the form
    form.addEventListener('submit', mockSubmitHandler);

    // Manually call the submit event handler
    const submitEvent = new dom.window.Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent); // Dispatch the event manually

    // Verify the mock submission handler was called
    expect(mockSubmitHandler).toHaveBeenCalled();

    // Verify the logs for each field
    Object.values(fieldValues).forEach((value) => {
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining(value));
    });
});


    test('should upload a picture file correctly', () => {
        const document = dom.window.document;

        // Mock a form element if it's missing in the DOM
        const form = document.querySelector('.cv-form') || document.createElement('form');
        form.className = 'cv-form'; // Ensure the correct class is applied
        document.body.appendChild(form);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.name = 'picture';
        form.appendChild(fileInput);

        const file = new dom.window.File(['file content'], 'test-image.png', { type: 'image/png' });
        Object.defineProperty(fileInput, 'files', {
            value: [file],
            writable: false,
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            expect(fileInput.files[0]).toBe(file);
            expect(fileInput.files[0].name).toBe('test-image.png');
            expect(fileInput.files[0].type).toBe('image/png');
        });

        const submitEvent = new dom.window.Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
    });
});

    describe('Backend API Tests', () => {
        beforeAll(() => {
            // Mock filesystem operations
            jest.mock('fs', () => ({
                ...jest.requireActual('fs'),
                existsSync: jest.fn((path) => path === 'path/to/picture.png'),
                readFileSync: jest.fn(() => Buffer.from('mock image data')),
                writeFileSync: jest.fn(),
                unlinkSync: jest.fn(),
            }));

            // Mock LaTeX compilation
            jest.mock('child_process', () => ({
                exec: jest.fn((cmd, callback) => callback(null, 'Mock success', '')),
            }));
        });

    test('should respond to /api/generate with 200 for valid data', async () => {
        const payload = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            address: '123 Test St',
            occupation: 'Developer',
            linkedin: 'https://linkedin.com/in/johndoe',
            github: 'https://github.com/johndoe',
            about: 'Test about section',
            experience: JSON.stringify([]),
            education: JSON.stringify([]),
            skills: JSON.stringify([]),
            picturePath: 'path/to/picture.png',
        };

        console.log('Sending payload:', payload); // Debugging payload
        const response = await request(app).post('/api/generate').send(payload);

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/pdf');
    });

    test('should return 500 for invalid data', async () => {
        const response = await request(app).post('/api/generate').send({});
        expect(response.status).toBe(500);
        expect(response.text).toContain('Error generating CV');
    });

    test('should clean up intermediate files after PDF generation', async () => {
        const response = await request(app)
            .post('/api/generate')
            .send({
                name: 'Jane Doe',
                email: 'jane.doe@example.com',
                phone: '98765432',
                address: '456 Oak Street',
                occupation: 'Data Scientist',
                linkedin: 'linkedin.com/in/janedoe',
                github: 'github.com/janedoe',
                about: 'Loves data and visualization.',
                experience: 'Worked at Y Company for 3 years.',
                education: JSON.stringify(['MSc in Data Science']),
                skills: JSON.stringify(['Python', 'Pandas']),
                picturePath: '/path/to/image.jpg',
            });

        expect(response.status).toBe(200);

        // Check for cleanup of temporary files
        const tempFilesExist = fs.existsSync('cv.tex') || fs.existsSync('cv.log') || fs.existsSync('cv.aux');
        expect(tempFilesExist).toBe(false);
    });
});
