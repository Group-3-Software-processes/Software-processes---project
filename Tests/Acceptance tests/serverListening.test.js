import axios from 'axios';

describe('Server Acceptance Tests', () => {
    it('should respond with status 404 for unknown routes', async () => {
        try {
            await axios.get('http://localhost:3000/unknown-route');
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });

    it('should listen on port 3000', async () => {
        const response = await axios.get('http://localhost:3000');
        expect(response.status).toBe(404);
    });
});
