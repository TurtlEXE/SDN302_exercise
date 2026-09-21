const express = require('express');
const articlesRouter = express.Router();

articlesRouter.use(express.json());
articlesRouter.use(express.urlencoded({ extended: true }));

articlesRouter.route('/')
    .get( async (req, res) => {
        try {
            res.status(200).end('Will send all the articles to you!');
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
    .post( async (req, res) => {
        try {
            res.status(200).json('Will add the article: ' + req.body.title + ' with details: ' + req.body.text + ' and ' + req.body.date);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
    .put( async (req, res) => {
        try {
            res.status(403).end('PUT operation not supported on /articles');
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
    .delete( async (req, res) => {
        try {
            res.status(200).end('Deleting all articles');
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
articlesRouter.route('/:id')
    .get( async (req, res) => {
        try {
            res.status(200).end('Will send details of the article: ' + req.params.id + ' to you!');
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
    .post( async (req, res) => {
        try {
            res.status(403).end('POST operation not supported on /articles/' + req.params.id);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
    .put( async (req, res) => {
        try {
            res.status(200).json('Updating the article: ' + req.params.id + '\nWill update the article: ' + req.body.title + ' with details: ' + req.body.text + ' and ' + req.body.date);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
    .delete( async (req, res) => {
        try {
            res.status(200).end('Deleting article: ' + req.params.id);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })

module.exports = articlesRouter;