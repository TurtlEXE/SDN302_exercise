const express = require('express');
const mongoose = require('mongoose');
const Comment = require('../models/comment');

const commentRouter = express.Router();

commentRouter.use(express.json());
commentRouter.use(express.urlencoded({ extended: true }));

commentRouter.route('/')
    .get(async (req, res) => {
        try {
            const comment = await Comment.find().populate('article');
            res.json(comment);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
    // POST a new comment
    .post(async (req, res) => {
        try {
            const comment = new Comment(req.body);
            await comment.save();
            res.status(201).json(comment);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    })
    .delete(async (req, res) => {
        try {
            await Comment.deleteMany({});
            res.status(200).send('All comments deleted successfully.');
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

commentRouter.route('/:id')
    .get(async (req, res) => {
        try {
            const comment = await Comment.findById(req.params.id).populate('article');
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found.' });
            }
            res.json(comment);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    })
    .put(async (req, res) => {
        try {
            const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found.' });
            }
            res.json(comment);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    })
    .delete(async (req, res) => {
        try {
            const comment = await Comment.findByIdAndDelete(req.params.id);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found.' });
            }
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

module.exports = commentRouter;
