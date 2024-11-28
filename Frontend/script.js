document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementsByClassName('cv-form')[0];

    // Existing form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual form submission

        // Retrieve values from each input field
        const name = form.querySelector('input[name="name"]').value;
        const email = form.querySelector('input[name="email"]').value;
        const phone = form.querySelector('input[name="phone"]').value;
        const address = form.querySelector('input[name="address"]').value;

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
        console.log(`Skill: ${skill}`);
        console.log(`Education: ${education}`);


        if (file) {
            console.log(`Picture: ${file.name} (${file.type}), ${file.size} bytes`);
        } else {
            console.log("No picture uploaded.");
        }
    });



    // Initialize counters for skills and education
    let skillsCount = 1;
    let educationCount = 1;

    // Function to add a new field (generic for skills, education, etc.)
    const addField = (fieldType, containerId, fieldPrefix) => {
        const maxFields = 7; // Maximum number of fields per section
        const fieldCount = fieldType === 'skills' ? skillsCount : educationCount;

        // Check if maximum number of fields is reached
        if (fieldCount >= maxFields) {
            alert(`You can only add up to ${maxFields} ${fieldType}.`);
            return;
        }

        // Increment the counter
        if (fieldType === 'skills') skillsCount++;
        if (fieldType === 'education') educationCount++;

        // Create new input element
        const newInput = document.createElement('input');
        newInput.name = `${fieldPrefix}${fieldCount + 1}`;
        newInput.id = `${fieldPrefix}${fieldCount + 1}`;
        newInput.placeholder = `${fieldPrefix.charAt(0).toUpperCase() + fieldPrefix.slice(1)}`;
        newInput.required = true;

        // Append to the container
        const container = document.getElementById(containerId);
        container.appendChild(newInput);
    };

    // Function to remove the last added field (generic for skills, education, etc.)
    const removeField = (fieldType, containerId, fieldPrefix) => {
        const fieldCount = fieldType === 'skills' ? skillsCount : educationCount;

        if (fieldCount > 1) {
            // Remove the last added field
            const container = document.getElementById(containerId);
            const lastField = container.querySelector(`#${fieldPrefix}${fieldCount}`);
            if (lastField) lastField.remove();

            // Decrement the counter
            if (fieldType === 'skills') skillsCount--;
            if (fieldType === 'education') educationCount--;
        } else {
            alert(`You must have at least one ${fieldType} field.`);
        }
    };

    // Add functionality to dynamically add more skill fields
    document.getElementById('addSkillButton').addEventListener('click', () => {
        addField('skills', 'skills-container', 'skill');
    });

    document.getElementById('removeSkillButton').addEventListener('click', () => {
        removeField('skills', 'skills-container', 'skill');
    });

    document.getElementById('addEducationButton').addEventListener('click', () => {
        addField('education', 'education-container', 'education');
    });

    document.getElementById('removeEducationButton').addEventListener('click', () => {
        removeField('education', 'education-container', 'education');
    });

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        const formData = new FormData(form);

        // Process dynamic fields (e.g., skills, education)
        const skills = Array.from(document.querySelectorAll('input[name^="skill"]')).map(input => input.value);
        const education = Array.from(document.querySelectorAll('input[name^="education"]')).map(input => input.value);

        // Add skills and education dynamically to the FormData
        skills.forEach(skill => formData.append('skills[]', skill));
        education.forEach(edu => formData.append('education[]', edu));

        fetch('http://127.0.0.1:5000/generate_cv', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'cv.tex';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error('Error generating CV:', error);
                alert('An error occurred while generating your CV. Please try again.');
            });
    });


    const buttons = document.querySelectorAll('.template-item button');
    let selectedTemplate = null;
  
    buttons.forEach(button => {
      button.addEventListener('click', function () {
        // Remove the 'selected' class from all buttons
        buttons.forEach(btn => btn.classList.remove('selected'));
  
        // Add the 'selected' class to the clicked button
        this.classList.add('selected');
  
        // Store the template number in the selectedTemplate variable
        selectedTemplate = this.getAttribute('data-template');
  
        // Log the selection for confirmation
        console.log(`Selected template: ${selectedTemplate}`);
      });
    });
  
    // Optional: Add a hidden input to the form to submit the selected template
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'selectedTemplate';
    form.appendChild(hiddenInput);
  
    // Update the hidden input value when a template is selected
    buttons.forEach(button => {
      button.addEventListener('click', function () {
        hiddenInput.value = selectedTemplate;
      });
    });
  });
  
