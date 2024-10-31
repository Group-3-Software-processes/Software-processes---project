document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('cv-form').addEventListener('submit', (e) => {
        e.preventDefault(); // Prevents form submission to the server

        // Get the file input
        const fileInput = document.querySelector('input[name="picture"]');
        const file = fileInput.files[0];

        if (file) {
            console.log(`File name: ${file.name}`);
            console.log(`File type: ${file.type}`);
            console.log(`File size: ${file.size} bytes`);
        } else {
            alert('No file selected');
        }
    });
});