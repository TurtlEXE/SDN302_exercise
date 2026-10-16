const express = require('express');
const mongoose = require('mongoose');
const Article = require('./models/article');

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/newspapers';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(url)
    .then(() => {
        console.log('Successfully connected to MongoDB at:', url);
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Exercise 14: Mongoose ODM & Validation',
        endpoints: {
            'GET /articles': 'List all articles',
            'GET /test-error': 'Demonstrate validation error',
            'GET /test-success': 'Demonstrate successful article creation'
        }
    });
});

// GET all articles
app.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to demonstrate validation error
app.get('/test-error', async (req, res) => {
    try {
        const invalidArticle = new Article({
            // Intentionally missing 'title'
            text: 'Short', // Triggers custom validator (must be > 10 chars)
            comments: [{ body: 'Great article!' }],
            tags: [] // Triggers custom validator (must not be empty)
        });

        await invalidArticle.save();
        res.json({ message: 'Saved successfully', article: invalidArticle });
    } catch (err) {
        res.status(400).json({
            status: 'Validation Error caught as expected!',
            errorName: err.name,
            message: err.message,
            errors: err.errors
        });
    }
});

// Route to demonstrate successful save
app.get('/test-success', async (req, res) => {
    try {
        const validArticle = new Article({
            title: 'Short News',
            text: 'Paris is known for its iconic landmarks like the Eiffel Tower and Louvre...',
            comments: [{ body: 'Great article!' }],
            tags: ['News']
        });

        const savedDoc = await validArticle.save();
        res.status(201).json({
            message: 'Article inserted successfully!',
            article: savedDoc
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Exercise 14 server running at http://localhost:${port}`);
    });
}

module.exports = app;
