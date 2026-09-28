const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Exercise 1: validateArticle middleware
const validateArticle = async (req, res, next) => {
    try {
        const { title, date, text } = req.body;

        // Check if title, date, and text are present
        if (!title || !date || !text) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Additional validation logic can be added here
        // ...

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error validating article');
    }
};

// POST a new article
app.post('/articles', validateArticle, async (req, res) => {
    try {
        res.status(201).end('Will add the article: ' + req.body.title + ' with details: ' + req.body.text + ' and ' + req.body.date);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

if (require.main === module) {
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

module.exports = app;
