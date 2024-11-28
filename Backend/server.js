import express from 'express';
import bodyParser from 'body-parser';
import { readFile, writeFile } from 'fs/promises';
import { exec } from 'child_process';
import { createConnection } from 'mysql2';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL database connection
const db = createConnection({
    host: 'localhost',
    user: 'cv_user',
    password: 'andreas04',
    database: 'UserProfileDB',
});

// May need to be changed
// Basic form validation
/*
document.querySelector('.register-form').addEventListener('submit', function (e) {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        e.preventDefault();
        alert('Passwords do not match. Please try again.');
    }
});
*/
/*
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database!');
});
*/
// Function to generate LaTeX file
const generateLatexFile = async(data, outputFile) => {
    let template = await readFile('templates/template2/template2.tex', 'utf8');

    // Replace placeholders with actual data
    template = template.replace('<NAME>', data.name || 'N/A')
        .replace('<OCCUPATION>', data.occupation1 || 'N/A')
        .replace('<EMAIL>', data.email || 'N/A')
        .replace('<PHONE>', data.phone || 'N/A')
        .replace('<ADDRESS>', data.address || 'N/A')
        .replace('<LINKEDIN>', data.linkedin || 'N/A')
        .replace('<GITHUB>', data.github || 'N/A')
        .replace('<ABOUT_ME>', data.about || 'N/A')
        .replace('<EXPERIENCE>', data.experience || 'N/A');
    
    // Handle dynamic lists for education and skills
    const educationList = (data.education1 || []).map(item => `    \\item ${item}`).join('\n');
    const skillsList = (data.skill1 || []).map(skill => `    \\item ${skill}`).join('\n');
    
    template = template.replace('<EDUCATION_LIST>', educationList || '    \\item N/A')
        .replace('<SKILLS_LIST>', skillsList || '    \\item N/A');
    

    // Replace picture path
    template = template.replace('<PICTURE_PATH>', data.picturePath || '');

    writeFile(outputFile, template);
    console.log(`LaTeX file generated: ${outputFile}`);
};
const texFilePath = '/home/madpakken/02369_Software_processes_and_patterns/Software-processes---project/output/CV.tex';
const outputDir = '/output';

// POST route to generate CV
app.post('/api/generate', (req, res) => {
    const {
        name,
        email,
        phone,
        occupation,
        address,
        linkedin,
        github,
        about,
        experience,
        education,
        skills,
        picturePath,
    } = req.body;

    const outputFile = 'output/CV.tex';

    // Call the function to generate LaTeX
    generateLatexFile({
        name,
        email,
        phone,
        occupation1: occupation,
        address,
        linkedin,
        github,
        about,
        experience,
        education1: JSON.parse(education || '[]'), // Parse JSON string to array
        skill1: JSON.parse(skills || '[]'), // Parse JSON string to array
        picturePath,
    }, outputFile);

    // Compile LaTeX to PDF

    exec(`pdflatex -output-directory=/home/madpakken/02369_Software_processes_and_patterns/Software-processes---project/output /home/madpakken/02369_Software_processes_and_patterns/Software-processes---project/output/CV.tex
`, (err, stdout, stderr) => {

        if (err) {
            console.error('Error compiling LaTeX:', stderr);
            return res.status(500).send('Error generating CV.');
        }
        console.log('LaTeX compilation output:', stdout);
        // Send the generated PDF to the client
        res.download('output/CV.pdf', 'output/CV.pdf', (err) => {
            if (err) console.error('Error sending PDF:', err);
        });
    });
});

// Start server
app.listen(3000, () => console.log('Server running on port 3000'));