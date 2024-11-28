DROP DATABASE UserProfileDB;
CREATE DATABASE UserProfileDB;

Use UserProfileDB;

CREATE TABLE UserProfiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    faceshot BLOB,  -- Use a BLOB to store binary data for an image file
    address TEXT,
    linkedin_profile VARCHAR(255),
    github_profile VARCHAR(255),
    education TEXT,  -- Store education history as a comma-separated list
    occupation VARCHAR(100),
    experience TEXT,  -- Store multiple experiences as a comma-separated list
    skills TEXT,  -- Store multiple skills as a comma-separated list
    about_me TEXT
);