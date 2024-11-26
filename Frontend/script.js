document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('cv-form');

    // Function to add a new field (generic for skills, education, etc.)
    const addField = (fieldType, containerId, fieldPrefix) => {
        let fieldCount = window[`${fieldType}Count`] || 1; // Dynamic field count
        const maxFields = 7; // Maximum number of fields per section

        // Check if maximum number of fields is reached
        if (fieldCount >= maxFields) {
            alert(`You can only add up to ${maxFields} ${fieldType}.`);
            return;
        }

        fieldCount++;
        window[`${fieldType}Count`] = fieldCount; // Update the count

        // Create new input element
        const newInput = document.createElement('input');
        newInput.name = `${fieldPrefix}${fieldCount}`;
        newInput.id = `${fieldPrefix}${fieldCount}`;
        newInput.placeholder = `${fieldPrefix.charAt(0).toUpperCase() + fieldPrefix.slice(1)}`;
        newInput.required = true;

        // Create a line break element
        const lineBreak = document.createElement('br');
        lineBreak.id = `br${fieldPrefix}${fieldCount}`;

        // Append to the container
        const container = document.getElementById(containerId);
        container.appendChild(lineBreak);
        container.appendChild(newInput);
    };

    // Function to remove the last added field (generic for skills, education, etc.)
    const removeField = (fieldType, containerId, fieldPrefix) => {
        let fieldCount = window[`${fieldType}Count`] || 1;

        if (fieldCount > 1) {
            // Remove the last added field and its line break
            document.getElementById(`${fieldPrefix}${fieldCount}`).remove();
            document.getElementById(`br${fieldPrefix}${fieldCount}`).remove();
            fieldCount--;
            window[`${fieldType}Count`] = fieldCount; // Update count
        } else {
            alert(`You must have at least one ${fieldType} field.`);
        }
    };

    // Add functionality to dynamically add more skill fields
    const addSkillField = () => addField('skills', 'skills-container', 'skill');

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
});
