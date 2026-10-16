const mongoose = require('mongoose');
const Article = require('./models/article');

const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/newspapers';

mongoose.connect(url)
    .then(async () => {
        console.log('Connected to MongoDB.');
        console.log('Testing valid article insertion...');

        const newArticle = new Article({
            title: 'Short News',
            text: 'Paris is known for its iconic landmarks like the Eiffel Tower and Louvre...',
            comments: [{ body: 'Great article!' }],
            tags: ['News']
        });

        return newArticle.save();
    })
    .then(doc => {
        console.log('Article saved:', doc);
        return mongoose.connection.close();
    })
    .catch(err => {
        console.error('An error occurred:', err);
        mongoose.connection.close();
    });
