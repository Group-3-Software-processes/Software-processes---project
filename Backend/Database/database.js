import fs from 'fs';
import mysql2 from 'mysql2';

document.querySelector('.register-form').addEventListener('submit', function (e) {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        e.preventDefault();
        alert('Passwords do not match. Please try again.');
    }
});





app.post('/api/register', (req, res)=> {
    



});
function initDB() {
    return db = createConnection({
        host: 'localhost',
        user: 'cv_user',
        password: 'andreas04',
        database: 'UserProfileDB',
    });
}

function CreateDB(connection, dbName, sqlFilePath) {
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



module.exports = { initDB, createDB };