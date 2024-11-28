import express from 'express';
import bodyParser from 'body-parser';
import { readFile, writeFile } from 'fs/promises';
import { exec } from 'child_process';

//Own imports
// import {initDB, createDB} from './Database/database.js';

// Setup
const app = express();
app.use(bodyParser.urlencoded({ extended: true })); // For form-urlencoded data
app.use(bodyParser.json()); // For JSON data

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
    console.log('Request body:', req.body); // Log the raw request body
    if (process.env.NODE_ENV === 'test') {
        console.log('Mock download in test environment');
        res.set('Content-Type', 'application/pdf');
        return res.status(200).send('Mock PDF download successful');
    }

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

/*
const connection = initDB();
const dbName = "UserProfileDB";
const sqlFilePath = 'Backend/Database/createdb.sql';
createDB(connection, dbName, sqlFilePath)
    .then(() => {
        console.log('Database setup completed successfully.');
        connection.end(); // Close the connection after the setup
    })
    .catch(err => {
        console.error('Error during database setup:', err);
        connection.end(); // Close the connection in case of an error
    });
*/
export default app
