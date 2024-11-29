document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('status').innerText = 'Login successful!';
            // Set the loggedIn state
            localStorage.setItem('loggedIn', 'true');
            console.log('Logged in successfully:', result);
            window.location.href = 'index.html';
        } else {
            document.getElementById('status').innerText = `Login failed: ${result.error}`;
        }
    } catch (error) {
        document.getElementById('status').innerText = 'Error: ' + error.message;
    }
});