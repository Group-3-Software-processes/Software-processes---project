async function createUser(event) {
    event.preventDefault(); // Prevent the form from reloading the page

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Send data to the server
    const response = await fetch('/api/createuser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    });

    const result = await response.json();
    if (response.ok) {
        alert('User created successfully!');
    } else {
        alert('Error: ' + result.error);
    }
}