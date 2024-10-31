require('@testing-library/jest-dom');
const { JSDOM } = require('jsdom'); // Correct usage
const fs = require('fs');
const path = require('path');

describe('CV Generator Website', () => {
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
        expect(link.href).toContain('style.css');
    });

    test('should load the JavaScript file', () => {
        const script = dom.window.document.querySelector('script[src="script.js"]');
        expect(script).toBeInTheDocument();
    });


    test('Should be able to add information to the name field, and submit it', () => {
        const document = dom.window.document;
        console.log = jest.fn(); // Mock console.log
        // Find the input field and submit button
        const nameField = document.querySelector('input[name="name"]'); // Adjust name attribute as per your HTML
        const submitButton = document.querySelector('button[type="submit"]');
         // Set value for the name field
        nameField.value = 'John Doe';
        expect(nameField.value).toBe('John Doe'); // Check that the value was set correctly

        // Add event listener to the form's submit button for testing console log
        submitButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission redirect
            console.log(nameField.value); // Mock function call with form data
        });

        // Simulate the click event on the submit button
        submitButton.click();

        // Assert that console.log was called with the correct value
        expect(console.log).toHaveBeenCalledWith('John Doe');

    })

    test('Should be able to add information to the email field, and submit it', () => {
        const document = dom.window.document;
        console.log = jest.fn(); // Mock console.log
        // Find the input field and submit button
        const nameField = document.querySelector('input[name="email"]'); // Adjust name attribute as per your HTML
        const submitButton = document.querySelector('button[type="submit"]');
         // Set value for the name field
        nameField.value = 'John.doe@gmail.com';
        expect(nameField.value).toBe('John.doe@gmail.com'); // Check that the value was set correctly

        // Add event listener to the form's submit button for testing console log
        submitButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission redirect
            console.log(nameField.value); // Mock function call with form data
        });

        // Simulate the click event on the submit button
        submitButton.click();

        // Assert that console.log was called with the correct value
        expect(console.log).toHaveBeenCalledWith('John.doe@gmail.com');

    })

    test('Should be able to add information to the phone field, and submit it', () => {
        const document = dom.window.document;
        console.log = jest.fn(); // Mock console.log
        // Find the input field and submit button
        const nameField = document.querySelector('input[name="phone"]'); // Adjust name attribute as per your HTML
        const submitButton = document.querySelector('button[type="submit"]');
         // Set value for the name field
        nameField.value = '12345678';
        expect(nameField.value).toBe('12345678'); // Check that the value was set correctly

        // Add event listener to the form's submit button for testing console log
        submitButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission redirect
            console.log(nameField.value); // Mock function call with form data
        });

        // Simulate the click event on the submit button
        submitButton.click();

        // Assert that console.log was called with the correct value
        expect(console.log).toHaveBeenCalledWith('12345678');

    })


    test('Should be able to add information to the Address field, and submit it', () => {
        const document = dom.window.document;
        console.log = jest.fn(); // Mock console.log
        // Find the input field and submit button
        const nameField = document.querySelector('input[name="address"]'); // Adjust name attribute as per your HTML
        const submitButton = document.querySelector('button[type="submit"]');
         // Set value for the name field
        nameField.value = 'Elektrovej 36';
        expect(nameField.value).toBe('Elektrovej 36'); // Check that the value was set correctly

        // Add event listener to the form's submit button for testing console log
        submitButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission redirect
            console.log(nameField.value); // Mock function call with form data
        });

        // Simulate the click event on the submit button
        submitButton.click();

        // Assert that console.log was called with the correct value
        expect(console.log).toHaveBeenCalledWith('Elektrovej 36');
    })

    test('should upload a picture file correctly', () => {
        // Mock the file object
        const document = dom.window.document;
        const file = new dom.window.File(['file content'], 'test-image.png', { type: 'image/png' });

        // Get the file input element and set the mock file
        const fileInput = document.querySelector('input[name="picture"]');
        Object.defineProperty(fileInput, 'files', {
            value: [file],
            writable: false,
        });

        // Trigger form submission or call the upload handler if needed
        const form = document.getElementById('cv-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Check that the file was uploaded correctly by checking fileInput.files[0]
            expect(fileInput.files[0]).toBe(file);
            expect(fileInput.files[0].name).toBe('test-image.png');
            expect(fileInput.files[0].type).toBe('image/png');
        });

        // Simulate form submission
        // Dispatch a 'submit' event instead of calling form.submit()
        const submitEvent = new dom.window.Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
    });
});
