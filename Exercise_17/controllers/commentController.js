const Comment = require('../models/comment');

exports.findAll = async (req, res) => {
    try {
        const comments = await Comment.find().populate('article');
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const comment = new Comment(req.body);
        await comment.save();
        res.status(201).json(comment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.findById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('article');
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }
        res.json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }
        res.json(comment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        await Comment.deleteMany({});
        res.status(200).send('All comments deleted successfully.');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
