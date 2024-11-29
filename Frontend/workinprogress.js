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
// Add skills and education dynamically to the FormData
skills.forEach(skill => formData.append('skills[]', skill));
education.forEach(edu => formData.append('education[]', edu));









    


