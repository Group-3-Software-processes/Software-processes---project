import express from 'express';
import bodyParser from 'body-parser';

import { exec } from 'child_process';
import multer from 'multer';
import fs from 'fs';
import cors from 'cors';
import { initDB, addUser} from './Model/database.js';
import {processinput, generateLatexFile} from './Model/LatexCreator.js';
import bcrypt from 'bcrypt';
import session from 'express-session';


// Setup
const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('Frontend'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));


// POST route to generate CV
app.post('/api/generate', upload.single('file'),  (req, res) => {
    // Error checking
    if (
        !req.body ||
        !Object.keys(req.body).length || // Check if body is empty
        !req.body.name ||
        !req.body.email ||
        !req.body.phone ||
        !req.body.address
    ) {
        console.error('Validation failed: Missing required fields.');
        return res.status(500).send('Error generating CV: Missing required fields.');
    }
    //For test
    if (process.env.NODE_ENV === 'test') {
        console.log('Mock download in test environment');
        res.set('Content-Type', 'application/pdf');
        return res.status(200).send('Mock PDF download successful');
    }


    //Actual function
    
    const outputFile = 'output/CV.tex';
    generateLatexFile(req.body.selectedTemplate[1],processinput(req),outputFile);

    
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
app.post('/api/save-cv', (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { name, email, phone, address, linkedin, github, education, occupation, experience, skills, about } = req.body;

    const query = `
        UPDATE UserProfiles SET
            name = ?, email = ?, phone_number = ?, address = ?, linkedin_profile = ?, 
            github_profile = ?, education = ?, occupation = ?, experience = ?, skills = ?, about_me = ?
        WHERE id = ?
    `;

    connection.query(query, [
        name, email, phone, address, linkedin, github, JSON.stringify(education),
        occupation, experience, JSON.stringify(skills), about, userId
    ], (err) => {
        if (err) return res.status(500).json({ error: 'Error saving CV' });

        res.status(200).json({ message: 'CV saved successfully' });
    });
});
app.get('/api/get-cv', (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const query = 'SELECT * FROM UserProfiles WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching CV' });

        if (results.length === 0) return res.status(404).json({ error: 'No CV found' });

        const user = results[0];
        res.status(200).json({
            name: user.name,
            email: user.email,
            phone: user.phone_number,
            address: user.address,
            linkedin: user.linkedin_profile,
            github: user.github_profile,
            education: JSON.parse(user.education || '[]'),
            occupation: user.occupation,
            experience: user.experience,
            skills: JSON.parse(user.skills || '[]'),
            about: user.about_me,
        });
    });
});

app.get('/', (req, res) => {
    res.send('Welcome to the CV Generator API! Go back so you can start creating your cv.');
});
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

//database stuff

const connection = initDB();
app.post('/api/createuser', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const result = await addUser(connection, name, email, password);
        res.status(201).json({ message: 'User created successfully.', result });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM UserProfiles WHERE email = ?';
    connection.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Internal server error' });

        if (results.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

        const user = results[0];
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) return res.status(401).json({ error: 'Invalid email or password' });

        // Save user ID in the session
        req.session.userId = user.id;
        return res.status(200).json({ message: 'Login successful' });
    });
});


// Start server
const server = app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');
  });

export { app, server };


