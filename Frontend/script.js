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


document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('cvForm');

        // Existing form submission handler
        form.addEventListener('submit', async function (e) {
            if (!selectedTemplate) {
                e.preventDefault(); // Prevent actual form submission
                alert('Please select a template before generating your CV.');
                return;
            }
            e.preventDefault(); // Prevent actual form submission
            
            
            const formData = new FormData(form);
            // Log the form data to see the result (for debugging)
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
            




            try {
                const response = await fetch('http://127.0.0.1:3000/api/generate', {
                    method: 'POST',
                    body: formData, // Pass the FormData object as the request body
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                // If the response is a file (e.g., PDF), download it
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
    
                // Create a temporary link to trigger a download
                const a = document.createElement('a');
                a.href = url;
                a.download = 'CV.pdf'; // Default file name
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url); // Clean up the URL object

            } catch (error) {
                console.log(error);
        }
        });






    const buttons = document.querySelectorAll('.template-item button');
    const generateButton = document.getElementById('generateButton');
    let selectedTemplate = null;

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'selectedTemplate';
    form.appendChild(hiddenInput);


    buttons.forEach(button => {
        button.addEventListener('click', function () {
          // Remove the 'selected' class from all buttons
          buttons.forEach(btn => btn.classList.remove('selected'));
    
          // Add the 'selected' class to the clicked button
          this.classList.add('selected');
    
          // Store the template number in the selectedTemplate variable
          selectedTemplate = this.getAttribute('data-template');
          hiddenInput.value = selectedTemplate;
    
          // Log the selection for confirmation
          console.log(`Selected template: ${selectedTemplate}`);
          if (selectedTemplate) {
            generateButton.disabled = false;
          }
        });
      });




  });

  //Unfinished part for using logged in state to store information and pop it into the fields for ease of use
  /*
  //For loading and adding to database
  document.addEventListener('DOMContentLoaded', async () => {
    // Form fields
    const nameField = document.querySelector('#name');
    const emailField = document.querySelector('#email');
    const phoneField = document.querySelector('#phone');
    const addressField = document.querySelector('#address');
    const linkedinField = document.querySelector('#linkedin');
    const githubField = document.querySelector('#github');
    const educationField = document.querySelector('#education1');
    const occupationField = document.querySelector('textarea[name="occupation"]');
    const experienceField = document.querySelector('textarea[name="experience"]');
    const skillField = document.querySelector('#skill1');
    const aboutField = document.querySelector('textarea[name="about"]');
    const generateButton = document.querySelector('#generateButton');
    const form = document.querySelector('#cvForm');

    // Function to populate form fields with data from the backend
    async function fetchCV() {
        try {
            const response = await fetch('/api/get-cv');
            if (response.ok) {
                const data = await response.json();

                // Populate fields
                nameField.value = data.name || '';
                emailField.value = data.email || '';
                phoneField.value = data.phone || '';
                addressField.value = data.address || '';
                linkedinField.value = data.linkedin || '';
                githubField.value = data.github || '';
                educationField.value = (data.education && data.education[0]) || '';
                occupationField.value = data.occupation || '';
                experienceField.value = data.experience || '';
                skillField.value = (data.skills && data.skills[0]) || '';
                aboutField.value = data.about || '';

                // Enable Generate button if data is loaded
                generateButton.disabled = false;
            } else {
                console.log('No saved CV found or not logged in yet');
            }
        } catch (error) {
            console.error('Error fetching CV:', error);
        }
    }

    // Call fetchCV on page load
    await fetchCV();

    // Event listener to handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        const data = {
            name: nameField.value,
            email: emailField.value,
            phone: phoneField.value,
            address: addressField.value,
            linkedin: linkedinField.value,
            github: githubField.value,
            education: [educationField.value],
            occupation: occupationField.value,
            experience: experienceField.value,
            skills: [skillField.value],
            about: aboutField.value,
        };

        try {
            const response = await fetch('/api/save-cv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert('CV saved successfully!');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to save CV');
            }
        } catch (error) {
            console.error('Error saving CV:', error);
        }
    });
});
  */
