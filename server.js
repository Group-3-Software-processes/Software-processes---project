const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
const mysql = require('mysql2');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'cv_user',
    password: 'andreas04',
    database: 'UserProfileDB'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database!');
});


app.post('/api/generate', (req, res) => {
    const { name, email, phone } = req.body;

    // Generate LaTeX content
    const latex = `
    \\documentclass{article}
    \\begin{document}
    \\section*{CV}
    Name: ${name} \\\\
    Email: ${email} \\\\
    Phone: ${phone}
    \\end{document}
    `;

    fs.writeFileSync('cv.tex', latex);

    // Compile LaTeX to PDF
    exec('pdflatex cv.tex', (err) => {
        if (err) return res.status(500).send('Error generating CV.');
        res.download('cv.pdf'); // Send the PDF to the user
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
