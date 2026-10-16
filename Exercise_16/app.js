const express = require('express');
const mongoose = require('mongoose');
const articleRouter = require('./routes/articleRouter');
const commentRouter = require('./routes/commentRouter');

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/newspapers';

// Middleware
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

// Root welcome endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Exercise 16: Mongoose Population Demo',
        endpoints: {
            articles: '/articles',
            comments: '/comments'
        }
    });
});

// Mount routers
app.use('/articles', articleRouter);
app.use('/comments', commentRouter);

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
