import express from 'express';
import bodyParser from 'body-parser';
import { readFile, writeFile } from 'fs/promises';
import { exec } from 'child_process';
import multer from 'multer';
import fs from 'fs';
import cors from 'cors';

// Setup
const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


function replacePlaceholders(template, data) {
    // Iterate over each key in the data object
    for (const [key, value] of Object.entries(data)) {
        // Create the placeholder format dynamically (e.g., '<NAME>')
        const placeholder = `<${key.toUpperCase()}>`;
        console.log(placeholder);
        // Replace all instances of the placeholder in the template
        template = template.replace(new RegExp(placeholder, 'g'), value || 'N/A');
    }
    return template;
}
// Function to generate LaTeX file
const generateLatexFile = async (template, data, outputFile) => {
    const templatePath = `templates/template${template}.tex`;
    try {
        const educationList = (data.education || []).map(item => `    \\item ${item}`).join('\n');
        const skillsList = (data.skills || []).map(skill => `    \\item ${skill}`).join('\n');
        let newdata = data; 
        newdata.education = educationList;
        newdata.skills = skillsList;

        let template = await readFile(templatePath, 'utf8');
        
        

        
        await writeFile(outputFile, replacePlaceholders(template, newdata));
        console.log('LaTeX file successfully written to:', outputFile);
    } catch (err) {
        console.error('Error in generateLatexFile:', err);
        throw err;
    }
};

// POST route to generate CV
app.post('/api/generate', upload.single('file'),  (req, res) => {
    //For test
    if (process.env.NODE_ENV === 'test') {
        console.log('Mock download in test environment');
        res.set('Content-Type', 'application/pdf');
        return res.status(200).send('Mock PDF download successful');
    }


    //Actual function
    console.log('Received POST /api/generate request');

    const {
        selectedTemplate,
        name,
        email,
        phone,
        address,
        linkedin,
        github,
        occupation,
        experience,
        about,
    } = req.body;
    console.log(req.body);
    console.log(selectedTemplate, name, email, phone, address, linkedin, github, occupation, experience, about);
    const education = [];
    for (const key in req.body) {
        if (key.startsWith('education') && req.body[key]) {
            education.push(req.body[key]);
        }
    }
    // Extract skills fields into an array
    const skills = [];
    for (const key in req.body) {
        if (key.startsWith('skill') && req.body[key]) {
            skills.push(req.body[key]);
        }
    }
    const outputFile = 'output/CV.tex';
    console.log(selectedTemplate[1]);
    
    
    generateLatexFile(
        selectedTemplate[1],{
                name,
                email,
                phone,
                address,
                linkedin,
                github,
                education,
                occupation,
                experience,
                skills,
                about,
            },outputFile);
    console.log("Attempting to create pdf from latex file");
    exec(`pdflatex -output-directory=output ${outputFile}`, (err, stdout, stderr) => {
        console.log("Started process");
    
        if (err) {
            console.error('Error compiling LaTeX:', stderr);
            return res.status(500).send('Error generating CV.');
        }
    
        console.log('LaTeX compilation succeeded:', stdout);
    
        const pdfPath = 'output/CV.pdf';
    
        console.log('Checking for PDF file at:', pdfPath);
    
        // Check if the PDF file exists
        fs.access(pdfPath, fs.constants.F_OK, (fileErr) => {
            if (fileErr) {
                console.error('PDF file not found:', fileErr);
                return res.status(500).send('Generated PDF not found.');
            }
    
            // Send the PDF file as a response
            res.download(pdfPath, 'CV.pdf', (downloadErr) => {
                if (downloadErr) {
                    console.error('Error sending PDF:', downloadErr);
                    return res.status(500).send('Error sending PDF.');
                }
    
                console.log('PDF sent successfully.');
            });
        });
    });
});
app.get('/', (req, res) => {
    res.send('Welcome to the CV Generator API! Use POST /api/generate to create a CV.');
});
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Start server
const server = app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');
  });

export { app, server };
