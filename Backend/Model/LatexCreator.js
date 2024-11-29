import { readFile, writeFile } from 'fs/promises';


export function processinput(req) {
    const {
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
    
    return {name,
    email,
    phone,
    address,
    linkedin,
    github,
    education,
    occupation,
    experience,
    skills,
    about}
}



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
export const generateLatexFile = async (template, data, outputFile) => {
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