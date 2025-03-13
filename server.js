const express = require('express');
const fetchData = require('./fetchData'); // Ensure this is correctly imported
const processData = require('./processData');
const generateFiles = require('./generateFiles');
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 3000;

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
});

// Routes
app.get('/api/top50', async (req, res) => {
    try {
        const data = await fetchData.getTop50Times();  // Correct function call
        res.json(data);
    } catch (error) {
        logger.error('Error fetching top 50 times:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/acuts', async (req, res) => {
    try {
        const data = await fetchData.getACutTimes();  // Correct function call
        res.json(data);
    } catch (error) {
        logger.error('Error fetching A cuts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/selection-rounds', async (req, res) => {
    try {
        const data = await processData.getSelectionRounds();
        res.json(data);
    } catch (error) {
        logger.error('Error processing selection rounds:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
