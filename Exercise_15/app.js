const express = require('express');
const mongoose = require('mongoose');
const articleRouter = require('./routes/articleRouter');

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/newspapers';

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(url)
    .then(() => {
        console.log(`Connected to MongoDB at ${url}`);
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Exercise 15: Restful API with Node app and MongoDB',
        endpoints: [
            'GET    /articles',
            'POST   /articles',
            'PUT    /articles (403 forbidden)',
            'DELETE /articles',
            'GET    /articles/:id',
            'POST   /articles/:id (403 forbidden)',
            'PUT    /articles/:id',
            'DELETE /articles/:id'
        ]
    });
});

// Mount articleRouter on /articles
app.use('/articles', articleRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

module.exports = app;
