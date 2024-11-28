// Imports
import fs from 'fs';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';

// Function to initialize the database connection
export function initDB() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'cv_user',
        password: 'andreas04',
        database: 'UserProfileDB'
    });
}

// Function to create a database if it does not exist
export function createDB(connection, dbName, sqlFilePath) {
    return new Promise((resolve, reject) => {
        // Check if the database already exists
        connection.query(`SHOW DATABASES LIKE '${dbName}'`, (err, results) => {
            if (err) {
                reject('Error checking database existence: ' + err);
                return;
            }
            
            if (results.length === 0) {
                // Database does not exist, so create it
                connection.query(`CREATE DATABASE ${dbName}`, (err) => {
                    if (err) {
                        reject('Error creating database: ' + err);
                        return;
                    }
                    console.log(`Database '${dbName}' created successfully.`);
                    // Now load the SQL script to set up the tables
                    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
                    connection.query(sqlScript, (err, results) => {
                        if (err) {
                            reject('Error executing SQL script: ' + err);
                            return;
                        }
                        console.log('SQL script executed successfully.');
                        resolve(results);
                    });
                });
            } else {
                console.log(`Database '${dbName}' already exists.`);
                resolve(); // No need to create the database again
            }
        });
    });
}


// Function to add a user (name and password only)
export function addUser(connection, name, email, password) {
    return new Promise((resolve, reject) => {
        // Hash the password before storing it
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                reject('Error hashing password: ' + err);
                return;
            }

            const query = `INSERT INTO UserProfiles (email, password) VALUES (?, ?, ?)`;
            connection.query(query, [name, email, hashedPassword], (err, results) => {
                if (err) {
                    reject('Error inserting user: ' + err);
                    return;
                }
                console.log(`User '${name}' added successfully.`);
                resolve(results);
            });
        });
    });
}

// Function to update user profile information
export function addUserDetails(connection, userId, details) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE UserProfiles SET
                phone_number = ?, 
                faceshot = ?, 
                address = ?, 
                linkedin_profile = ?, 
                github_profile = ?, 
                education = ?, 
                occupation = ?, 
                experience = ?, 
                skills = ?, 
                about_me = ?
            WHERE id = ?
        `;
        
        connection.query(query, [
            details.phone_number,
            details.faceshot, // Should be a Buffer or Blob if storing binary data
            details.address,
            details.linkedin_profile,
            details.github_profile,
            details.education,
            details.occupation,
            details.experience,
            details.skills,
            details.about_me,
            userId
        ], (err, results) => {
            if (err) {
                reject('Error updating user details: ' + err);
                return;
            }
            console.log(`User details for '${userId}' updated successfully.`);
            resolve(results);
        });
    });
}