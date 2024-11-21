import express from 'express';
import bodyParser from 'body-parser';
import { writeFileSync, readFileSync } from 'fs';
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

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database!');
});

// Function to generate LaTeX file
const generateLatexFile = (data, outputFile) => {
    let template = readFileSync('./Template1.tex', 'utf8');

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

    writeFileSync(outputFile, template);
    console.log(`LaTeX file generated: ${outputFile}`);
};

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

    const outputFile = './output/cv.tex';

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
    exec(`pdflatex -output-directory=./output ${outputFile}`, (err, stdout, stderr) => {
        if (err) {
            console.error('Error compiling LaTeX:', stderr);
            return res.status(500).send('Error generating CV.');
        }

        // Send the generated PDF to the client
        res.download('./output/cv.pdf', 'cv.pdf', (err) => {
            if (err) console.error('Error sending PDF:', err);
        });

        // Optional: Clean up intermediate files
        exec(`rm ${outputFile} ./output/cv.log ./output/cv.aux`, (cleanupErr) => {
            if (cleanupErr) console.error('Error cleaning up files:', cleanupErr);
        });
    });
});

// Start server
app.listen(3000, () => console.log('Server running on port 3000'));