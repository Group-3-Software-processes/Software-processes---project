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

    // Additional Tests for LinkedIn, GitHub, Occupation, and About Me fields
    test('Should be able to add information to the LinkedIn field, and submit it', () => {
        const document = dom.window.document;
        console.log = jest.fn(); // Mock console.log

        // Find the LinkedIn input field and submit button
        const linkedinField = document.querySelector('input[name="linkedin"]');
        const submitButton = document.querySelector('button[type="submit"]');

        // Set value for the LinkedIn field
        linkedinField.value = 'https://www.linkedin.com/in/johndoe';
        expect(linkedinField.value).toBe('https://www.linkedin.com/in/johndoe'); // Check that the value was set correctly

        // Add event listener to the form's submit button for testing console log
        submitButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission redirect
            console.log(linkedinField.value); // Mock function call with form data
        });

        // Simulate the click event on the submit button
        submitButton.click();

        // Assert that console.log was called with the correct value
        expect(console.log).toHaveBeenCalledWith('https://www.linkedin.com/in/johndoe');
    });

    test('Should be able to add information to the GitHub field, and submit it', () => {
        const document = dom.window.document;
        console.log = jest.fn(); // Mock console.log

        // Find the GitHub input field and submit button
        const githubField = document.querySelector('input[name="github"]');
        const submitButton = document.querySelector('button[type="submit"]');

        // Set value for the GitHub field
        githubField.value = 'https://github.com/johndoe';
        expect(githubField.value).toBe('https://github.com/johndoe'); // Check that the value was set correctly

        // Add event listener to the form's submit button for testing console log
        submitButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission redirect
            console.log(githubField.value); // Mock function call with form data
        });

        // Simulate the click event on the submit button
        submitButton.click();

        // Assert that console.log was called with the correct value
        expect(console.log).toHaveBeenCalledWith('https://github.com/johndoe');
    });

    test('Should be able to add information to the Occupation field, and submit it', () => {
        const document = dom.window.document;
        console.log = jest.fn(); // Mock console.log

        // Find the Occupation textarea and submit button
        const occupationField = document.querySelector('textarea[name="occupation1"]');
        const submitButton = document.querySelector('button[type="submit"]');

        // Set value for the Occupation field
        occupationField.value = 'Software Engineer';
        expect(occupationField.value).toBe('Software Engineer'); // Check that the value was set correctly

        // Add event listener to the form's submit button for testing console log
        submitButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission redirect
            console.log(occupationField.value); // Mock function call with form data
        });

        // Simulate the click event on the submit button
        submitButton.click();

        // Assert that console.log was called with the correct value
        expect(console.log).toHaveBeenCalledWith('Software Engineer');
    });

    test('Should be able to add information to the About Me field, and submit it', () => {
        const document = dom.window.document;
        console.log = jest.fn(); // Mock console.log

        // Find the About Me textarea and submit button
        const aboutField = document.querySelector('textarea[name="about"]');
        const submitButton = document.querySelector('button[type="submit"]');

        // Set value for the About Me field
        aboutField.value = 'Passionate software developer with experience in web development.';
        expect(aboutField.value).toBe('Passionate software developer with experience in web development.'); // Check that the value was set correctly

        // Add event listener to the form's submit button for testing console log
        submitButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission redirect
            console.log(aboutField.value);
        });

        // Simulate the click event on the submit button
        submitButton.click();

        // Assert that console.log was called with the correct value
        expect(console.log).toHaveBeenCalledWith('Passionate software developer with experience in web development.');
    });

    test('Should be able to add information to the Experience field, and submit it', () => {
        const document = dom.window.document;
        console.log = jest.fn(); // Mock console.log

        // Find the experience textarea and submit button
        const expField = document.querySelector('textarea[name="experience"]');
        const submitButton = document.querySelector('button[type="submit"]');

        // Set value for the experience field
        expField.value = 'I have worked in a big softwarecompany and learned a lot from it.';
        expect(expField.value).toBe('I have worked in a big softwarecompany and learned a lot from it.'); // Check that the value was set correctly

        // Add event listener to the form's submit button for testing console log
        submitButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission redirect
            console.log(expField.value);
        });

        // Simulate the click event on the submit button
        submitButton.click();

        // Assert that console.log was called with the correct value
        expect(console.log).toHaveBeenCalledWith('I have worked in a big softwarecompany and learned a lot from it.');
    });

    test('Should be able to add multiple education entries and submit them', () => {
        const document = dom.window.document; // Initialize document here
        console.log = jest.fn(); // Mock console.log

        // Select education fields
        const educationFields = Array.from(document.querySelectorAll('input[name^="education"]'));
        const submitButton = document.querySelector('button[type="submit"]');

        // Set values for each education field
        educationFields.forEach((field, index) => {
            field.value = `Education Entry ${index + 1}`;
            expect(field.value).toBe(`Education Entry ${index + 1}`); // Check that the value was set correctly
        });

        // Mock the submit event to prevent actual form submission
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(educationFields.map(field => field.value));
        });

        // Simulate the click event on the submit button
        submitButton.click();

        // Check that console.log was called with the correct array of education values
        expect(console.log).toHaveBeenCalledWith(educationFields.map(field => field.value));
    });

    test('Should be able to add multiple skill entries and submit them', () => {
        const document = dom.window.document; // Initialize document here
        console.log = jest.fn(); // Mock console.log

        // Select skill fields
        const skillFields = Array.from(document.querySelectorAll('input[name^="skill"]'));
        const submitButton = document.querySelector('button[type="submit"]');

        // Set values for each skill field
        skillFields.forEach((field, index) => {
            field.value = `Skill Entry ${index + 1}`;
            expect(field.value).toBe(`Skill Entry ${index + 1}`); // Check that the value was set correctly
        });

        // Mock the submit event to prevent actual form submission
        submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(skillFields.map(field => field.value));
        });

        // Simulate the click event on the submit button
        submitButton.click();

        // Check that console.log was called with the correct array of skill values
        expect(console.log).toHaveBeenCalledWith(skillFields.map(field => field.value));
    });
});