const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON and urlencoded body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const articleRouter = require('./routes/articleRouter');
app.use('/articles', articleRouter);

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An unexpected error occurred' });
});

if (require.main === module) {
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

module.exports = app;
