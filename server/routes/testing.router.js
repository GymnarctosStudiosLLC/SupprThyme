// testing.router.js
import express from 'express';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

// Get the directory name using ES module syntax
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the base path for test data files
const testDataPath = join(__dirname, '../../test_data/cache');

// Define routes for each API endpoint
router.get('/typeahead/:city', async (req, res) => {
    const { city } = req.params;
    const fileName = `${city}TypeaheadTestData.json`;
    const filePath = join(testDataPath, fileName);
    await sendTestData(res, filePath);
});

router.get('/search/:city', async (req, res) => {
    const { city } = req.params;
    const fileName = `${city}SearchTestData.json`;
    const filePath = join(testDataPath, fileName);
    await sendTestData(res, filePath);
});

router.get('/details/:city', async (req, res) => {
    const { city } = req.params;
    const fileName = `${city}DetailsTestData.json`;
    const filePath = join(testDataPath, fileName);
    await sendTestData(res, filePath);
});

// Helper function to send test data from file
async function sendTestData(res, filePath) {
    try {
        const data = await readFile(filePath);
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    } catch (err) {
        console.error('Error reading test data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export default router;
