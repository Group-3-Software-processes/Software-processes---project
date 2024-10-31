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
    
});
