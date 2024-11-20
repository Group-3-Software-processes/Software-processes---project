document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('cv-form');

    // Existing form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual form submission

        // Retrieve values from each input field
        const name = form.querySelector('input[name="name"]').value;
        const email = form.querySelector('input[name="email"]').value;
        const phone = form.querySelector('input[name="phone"]').value;
        const address = form.querySelector('input[name="address"]').value;
        
        // Retrieve all education fields
        const education = Array.from(form.querySelectorAll('input[name^="education"]')).map(input => input.value);

        // Retrieve all skills fields
        const skills = Array.from(form.querySelectorAll('input[name^="skill"]')).map(input => input.value);

        const experience = form.querySelector('textarea[name="experience"]').value;
        const linkedin = form.querySelector('input[name="linkedin"]').value;
        const github = form.querySelector('input[name="github"]').value;
        const occupation = form.querySelector('textarea[name="occupation1"]').value;
        const aboutMe = form.querySelector('textarea[name="about"]').value;

        // Retrieve the file and display its details
        const fileInput = form.querySelector('input[name="picture"]');
        const file = fileInput.files[0];
        
        console.log("Form Data:");
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Phone: ${phone}`);
        console.log(`Address: ${address}`);
        console.log(`LinkedIn: ${linkedin}`);
        console.log(`GitHub: ${github}`);
        console.log(`Occupation: ${occupation}`);
        console.log(`About Me: ${aboutMe}`);
        console.log(`Experience: ${experience}`);
        console.log("Education:", education);
        console.log("Skills:", skills);

        if (file) {
            console.log(`Picture: ${file.name} (${file.type}), ${file.size} bytes`);
        } else {
            console.log("No picture uploaded.");
        }
        // *** New Code: Send Data to Backend ***
        const data = {
            name: name,
            email: email,
            phone: phone,
            address: address,
            linkedin: linkedin,
            github: github,
            education: education,
            skills: skills,
            experience: experience,
            occupation: occupation,
            about_me: aboutMe
        };

        fetch('http://127.0.0.1:5000/submit', { // Endpoint of the backend
            method: 'POST', // HTTP POST method
            headers: {
                'Content-Type': 'application/json', // Inform backend we are sending JSON
            },
            body: JSON.stringify(data), // Convert the JavaScript object to JSON
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data.message); // Log success message
                alert(data.message); // Display the success message to the user
            })
            .catch((error) => {
                console.error("Error:", error); // Log errors, if any
                alert("There was an error generating the CV."); // Display an error message
            });
        // *** End of New Code ***
    });

    // Function to add a new field (generic for skills, education, etc.)
    window.addField = function(fieldType, containerId, fieldPrefix) {
        let fieldCount = window[`${fieldType}Count`] || 1; // Use dynamic field count
        const maxFields = 7; // Maximum number of fields per section

        // Check if maximum number of fields is reached
        if (fieldCount >= maxFields) {
            alert(`You can only add up to ${maxFields} ${fieldType}.`);
            return;
        }

        fieldCount++; // Increment the counter for this field type
        window[`${fieldType}Count`] = fieldCount; // Update the field count

        // Create new input element
        const newInput = document.createElement('input');
        newInput.name = `${fieldPrefix}${fieldCount}`;
        newInput.id = `${fieldPrefix}${fieldCount}`;
        newInput.placeholder = `${fieldPrefix.charAt(0).toUpperCase() + fieldPrefix.slice(1)}`;
        newInput.required = true;

        // Create line break element
        const lineBreak = document.createElement('br');
        lineBreak.id = `br${fieldPrefix}${fieldCount}`;

        // Append new input and line break to the container
        const container = document.getElementById(containerId);
        container.appendChild(lineBreak);
        container.appendChild(newInput);
    };

    // Function to remove the last added field (generic for skills, education, etc.)
    window.removeField = function(fieldType, containerId, fieldPrefix) {
        let fieldCount = window[`${fieldType}Count`] || 1; // Use dynamic field count

        if (fieldCount > 1) {
            // Remove the last added field and its line break
            document.getElementById(`${fieldPrefix}${fieldCount}`).remove();
            document.getElementById(`br${fieldPrefix}${fieldCount}`).remove();
            fieldCount--; // Decrement the counter for this field type
            window[`${fieldType}Count`] = fieldCount; // Update the field count
        } else {
            alert(`You must have at least one ${fieldType} field.`);
        }
    };
});
