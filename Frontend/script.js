document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('cv-form');

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

        if (file) {
            console.log(`Picture: ${file.name} (${file.type}), ${file.size} bytes`);
        } else {
            console.log("No picture uploaded.");
        }
    });
});
