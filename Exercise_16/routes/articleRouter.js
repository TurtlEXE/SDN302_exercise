const express = require('express');
const Article = require('../models/article');

const articleRouter = express.Router();

articleRouter.use(express.json());
articleRouter.use(express.urlencoded({ extended: true }));

articleRouter.route('/')
    .get(async (req, res) => {
        try {
            const articles = await Article.find();
            res.json(articles);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
    .post(async (req, res) => {
        try {
            const article = new Article(req.body);
            await article.save();
            res.status(201).json(article);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    })
    .put(async (req, res) => {
        try {
            res.status(403).json('PUT operation not supported on /articles');
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    })
    .delete(async (req, res) => {
        try {
            await Article.deleteMany({});
            res.status(200).send('All articles deleted successfully.');
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

articleRouter.route('/:id')
    .get(async (req, res) => {
        try {
            const article = await Article.findById(req.params.id);
            if (!article) {
                return res.status(404).json({ message: 'Article not found.' });
            }
            res.json(article);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
    .post(async (req, res) => {
        try {
            res.status(403).end('POST operation not supported on /articles/' + req.params.id);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    })
    .put(async (req, res) => {
        try {
            const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!article) {
                return res.status(404).json({ message: 'Article not found.' });
            }
            res.json(article);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    })
    .delete(async (req, res) => {
        try {
            const article = await Article.findByIdAndDelete(req.params.id);
            if (!article) {
                return res.status(404).json({ message: 'Article not found.' });
            }
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

module.exports = articleRouter;
