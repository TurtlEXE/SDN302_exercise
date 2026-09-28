const express = require('express');
const articlesRouter = express.Router();

articlesRouter.use(express.json());
articlesRouter.use(express.urlencoded({ extended: true }));

articlesRouter.route('/')
    .get(async (req, res, next) => {
        try {
            res.status(200).end('Will send all the articles to you!');
        } catch (err) {
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            const { title, date, text } = req.body;
            const body = title || req.body.body;

            // Simulate article saving logic
            if (!body || !text || !date) {
                throw new Error("Missing required article fields");
            }

            // If the operation was successful, send a success response
            res.status(201).json({ message: "Article saved successfully" });
        } catch (err) {
            // Pass the error to the error-handling middleware
            next(err);
        }
    })
    .put(async (req, res, next) => {
        try {
            res.status(403).end('PUT operation not supported on /articles');
        } catch (err) {
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            res.status(200).end('Deleting all articles');
        } catch (err) {
            next(err);
        }
    });

articlesRouter.route('/:id')
    .get(async (req, res, next) => {
        try {
            res.status(200).end('Will send details of the article: ' + req.params.id + ' to you!');
        } catch (err) {
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            res.status(403).end('POST operation not supported on /articles/' + req.params.id);
        } catch (err) {
            next(err);
        }
    })
    .put(async (req, res, next) => {
        try {
            const { title, date, text } = req.body;
            const body = title || req.body.body;
            if (!body && !date && !text) {
                throw new Error("Missing fields to update article");
            }
            res.status(200).json('Updating the article: ' + req.params.id + '\nWill update the article: ' + (title || req.body.body || '') + ' with details: ' + (text || '') + ' and ' + (date || ''));
        } catch (err) {
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            res.status(200).end('Deleting article: ' + req.params.id);
        } catch (err) {
            next(err);
        }
    });

module.exports = articlesRouter;
