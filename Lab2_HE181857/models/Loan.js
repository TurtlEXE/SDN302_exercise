const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const loanSchema = new Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    member_id: {
        type: Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    items: [{
        _id: false,
        book_id: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
    }],
    borrowDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        required: true,
        enum: ["Borrowing", "Returned", "Overdue"],
    },
}, {
    // Enable timestamps to automatically add createdAt and updatedAt fields
    timestamps: true
});

const Loan = model('Loan', loanSchema);
module.exports = Loan;