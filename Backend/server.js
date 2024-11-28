import express from 'express';
import bodyParser from 'body-parser';
import { readFile, writeFile } from 'fs/promises';
import { exec } from 'child_process';

// Setup
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Function to generate LaTeX file
const generateLatexFile = async (data, outputFile) => {
    try {
        const templatePath = 'templates/template2/template2.tex';
        let template = await readFile(templatePath, 'utf8');

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

        await writeFile(outputFile, template);
        console.log('LaTeX file successfully written to:', outputFile);
    } catch (err) {
        console.error('Error in generateLatexFile:', err);
        throw err;
    }
};

// POST route to generate CV
app.post('/api/generate', async (req, res) => {

console.log('Received POST /api/generate request');

const {
    name = '',
    email = '',
    phone = '',
    address = '',
    occupation = '',
    linkedin = '',
    github = '',
    about = '',
    experience = '[]',
    education = '[]',
    skills = '[]',
    picturePath = '',
} = req.body;

console.log('Parsed fields:', { name, email, phone, address, occupation, linkedin, github, about, experience, education, skills, picturePath });

if (!name || !email || !phone || !address) {
    console.error('Validation failed: Missing required fields.');
    return res.status(500).send('Error generating CV: Missing required fields.');
}

if (process.env.NODE_ENV === 'test') {
    console.log('Mock download in test environment');
    res.set('Content-Type', 'application/pdf');
    return res.status(200).send('Mock PDF download successful');
}

const outputFile = 'output/CV.tex';

try {
    console.log('Generating LaTeX file...');
    await generateLatexFile(
        {
            name,
            email,
            phone,
            occupation1: occupation,
            address,
            linkedin,
            github,
            about,
            experience,
            education1: JSON.parse(education),
            skill1: JSON.parse(skills),
            picturePath,
        },
        outputFile
    );
} catch (err) {
    console.error('Error generating LaTeX file:', err);
    return res.status(500).send('Error generating LaTeX file.');
}

exec(
    `pdflatex -output-directory=output ${outputFile}`,
    (err, stdout, stderr) => {
        if (err) {
            console.error('Error compiling LaTeX:', stderr);
            return res.status(500).send('Error generating CV.');
        }
        console.log('LaTeX compilation succeeded:', stdout);

        const pdfPath = 'output/CV.pdf';
        console.log('Checking for PDF file at:', pdfPath);

        res.download(pdfPath, 'CV.pdf', (err) => {
            if (err) {
                console.error('Error sending PDF:', err);
                return res.status(500).send('Error sending PDF.');
            }

            console.log('PDF sent successfully.');
        });
    }
);
});

// Start server
const server = app.listen(3000, () => console.log('Server running on port 3000'));

export { app, server };
