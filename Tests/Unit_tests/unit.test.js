import fs from 'fs';
import { exec } from 'child_process';
import request from 'supertest';
import { server } from '../../Backend/server.js'; // Import server instance

// Mock child_process.exec
jest.mock('child_process', () => ({
    exec: jest.fn((cmd, callback) => {
        console.log(`Mock exec called with: ${cmd}`);
        callback(null, 'Mock LaTeX compilation success', ''); // Simulate success
    }),
}));

// Mock fs.existsSync to always return true for PDF file
jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: jest.fn((path) => {
        console.log(`Mock fs.existsSync called for: ${path}`);
        if (path === 'output/CV.pdf') {
            return true; // Pretend the PDF file exists
        }
        return false; // Default behavior for other paths
    }),
}));

test('should respond to POST /api/generate', async () => {
    const response = await request(server)
        .post('/api/generate')
        .send({
            name: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            occupation: 'Software Engineer',
            address: '123 Test Lane',
            linkedin: 'https://linkedin.com/in/testuser',
            github: 'https://github.com/testuser',
            about: 'This is a test about section.',
            experience: '[]',
            education: '[]',
            skills: '[]',
            picturePath: '/path/to/picture',
        });
    expect(response.status).toBe(200); // Expect success
});

afterAll((done) => {
    jest.resetAllMocks();
    server.close(done);
});
