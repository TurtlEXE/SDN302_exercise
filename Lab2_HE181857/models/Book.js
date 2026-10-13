const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const bookSchema = new Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    publishedYear: {
        type: Number,
        required: true
    },
    totalCopies: {
        type: Number,
        required: true,
        min: 0
    },
    availableCopies: {
        type: Number,
        required: true,
        min: 0
    },

}, {
    // Enable timestamps to automatically add createdAt and updatedAt fields
    timestamps: true
});

const Book = model('Book', bookSchema);
module.exports = Book;