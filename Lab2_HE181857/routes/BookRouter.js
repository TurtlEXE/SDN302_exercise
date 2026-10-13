const express = require('express');
const bookController = require('../controllers/BookController');

const router = express.Router();

// Get all customers
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
// Create a new customer
router.post('/', bookController.createBook);
// Update an existing customer
router.put('/:id', bookController.updateBook);
// Delete a customer
router.delete('/:id', bookController.deleteBook);

module.exports = router;