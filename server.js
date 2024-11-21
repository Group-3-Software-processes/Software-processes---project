import express from 'express';
import bodyParser from 'body-parser';
import { writeFileSync, readFileSync } from 'fs';
import { exec } from 'child_process';
import { createConnection } from 'mysql2';
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));


const db = createConnection({
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
const generateLatexFile = (data, outputFile) => {
    // Read the LaTeX template
    let template = readFileSync('./template.tex', 'utf8');

    // Replace placeholders with actual data
    template = template.replace('<NAME>', data.name)
                       .replace('<OCCUPATION>', data.occupation1)
                       .replace('<EMAIL>', data.email)
                       .replace('<PHONE>', data.phone)
                       .replace('<ADDRESS>', data.address)
                       .replace('<LINKEDIN>', data.linkedin)
                       .replace('<GITHUB>', data.github)
                       .replace('<ABOUT_ME>', data.about)
                       .replace('<EXPERIENCE>', data.experience);

    // Handle dynamic lists
    const educationList = data.education1.map(item => `    \\item ${item}`).join('\n');
    const skillsList = data.skill1.map(skill => `    \\item ${skill}`).join('\n');

    template = template.replace('<EDUCATION_LIST>', educationList)
                       .replace('<SKILLS_LIST>', skillsList);

    // Replace the picture placeholder with the actual file path
    template = template.replace('<PICTURE_PATH>', data.picturePath);

    // Write the final LaTeX content to an output file
    writeFileSync(outputFile, template);

    console.log(`LaTeX file generated: ${outputFile}`);
};

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

    writeFileSync('cv.tex', latex);

    // Compile LaTeX to PDF
    exec('pdflatex cv.tex', (err) => {
        if (err) return res.status(500).send('Error generating CV.');
        res.download('cv.pdf'); // Send the PDF to the user
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
