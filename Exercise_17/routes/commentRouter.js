const express = require('express');
const commentController = require('../controllers/commentController');
const commentRouter = express.Router();

commentRouter.use(express.json());
commentRouter.use(express.urlencoded({ extended: true }));

commentRouter.route('/')
    .get(commentController.findAll)
    .post(commentController.create)
    .delete(commentController.deleteAll);

commentRouter.route('/:id')
    .get(commentController.findById)
    .put(commentController.update)
    .delete(commentController.delete);

module.exports = commentRouter;
