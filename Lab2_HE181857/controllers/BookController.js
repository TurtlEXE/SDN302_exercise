const Book = require('../models/Book');

// Get all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single book by ID
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new customer
const createBook = async (req, res) => {
    try {
        const { title, author, category, isbn, publishedYear, totalCopies, availableCopies} = req.body;
        const newBook = new Book({ title, author, category, isbn, publishedYear, totalCopies, availableCopies});
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing customer
const updateBook = async (req, res) => {
    try {
        const { title, author, category, isbn, publishedYear, totalCopies, availableCopies} = req.body;
        const updateBook = await Book.findByIdAndUpdate(
            req.params.id,
            { title, author, category, isbn, publishedYear, totalCopies, availableCopies},
            { new: true, runValidators: true }
        );
        if (!updateBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(updateBook);
    }catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a customer
const deleteBook = async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};
