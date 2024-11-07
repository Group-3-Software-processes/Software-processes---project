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

        const experience = form.querySelector('input[name="experience"]').value; // Incorrect selector
        const education = form.querySelector('input[name="education"]').value;
        const skills = form.querySelector('input[name="skills"]').value;

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
        console.log(`Education: ${education}`);
        console.log(`Skills: ${skills}`);

        if (file) {
            console.log(`Picture: ${file.name} (${file.type}), ${file.size} bytes`);
        } else {
            console.log("No picture uploaded.");
        }
    });

    let skillCount = 1; // Start with one skill input field
    const maxSkills = 7; // Maximum number of skill fields

    window.addSkillField = function() {
        // Check if maximum number of skills is reached
        if (skillCount >= maxSkills) {
            alert("You can only add up to 7 skills.");
            return;
        }

        skillCount++; // Increment the counter

        // Create new skill input field
        const newInput = document.createElement('input');
        newInput.name = `skill${skillCount}`;
        newInput.id = `skill${skillCount}`;
        newInput.placeholder = "Skill";
        newInput.required = true;

        // Create a line break
        const lineBreak = document.createElement('br');
        lineBreak.id = `br${skillCount}`;

        // Append new input and line break to the skills container
        const skillsContainer = document.getElementById('skillsContainer');
        skillsContainer.appendChild(lineBreak);
        skillsContainer.appendChild(newInput);
    };

    window.removeSkillField = function() {
        if (skillCount > 1) {
            // Remove the last skill input field and its line break
            document.getElementById(`skill${skillCount}`).remove();
            document.getElementById(`br${skillCount}`).remove();
            skillCount--; // Decrement the counter
        } else {
            alert("You must have at least one skill field.");
        }
    };
});