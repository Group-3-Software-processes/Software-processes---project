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

    // Our skill field functionality below
    let skillCount = 1; // Counter for unique skill field names
    const maxSkills = 7; // Maximum number of skill fields

    window.addSkillField = function() {
        // Check if the current number of skills has reached the maximum
        if (skillCount >= maxSkills) {
            console.warn("You can only add up to 7 skills.");
            alert("You can only add up to 7 skills.");
            return;
        }

        skillCount++; // Increment the counter for unique naming

        // Creating a new input element
        const newInput = document.createElement('input');
        newInput.name = `skill${skillCount}`; // Set a unique name
        newInput.placeholder = "Skill"; // Set the placeholder
        newInput.required = true; // Make it required if needed

        // Create a line break
        const lineBreak = document.createElement('br');

        // Append the new input and the line break to the container
        document.getElementById('skillsContainer').appendChild(lineBreak);
        document.getElementById('skillsContainer').appendChild(newInput);
    };
});