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




    // Form submission handler


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
  
