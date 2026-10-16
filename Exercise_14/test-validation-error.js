const mongoose = require('mongoose');
const Article = require('./models/article');

const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/newspapers';

mongoose.connect(url)
    .then(async () => {
        console.log('Connected to MongoDB.');
        console.log('Testing schema validation error (missing title, text < 10 chars, empty tags)...');

        const newArticle = new Article({
            // Intentionally missing the 'title' field to trigger validation error
            text: 'Short', // This text will trigger custom validation error
            comments: [{ body: 'Great article!' }], // Comment is valid
            tags: [] // Empty array will trigger validation error for tags
        });

        return newArticle.save();
    })
    .then(doc => {
        console.log('Article saved:', doc);
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('An error occurred:', err);
        mongoose.connection.close();
    });
