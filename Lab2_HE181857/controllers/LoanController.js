const Loan = require('../models/Loan');
const Book = require('../models/Book');

// Get all loans
const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find().populate('member_id').populate('items.book_id');
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single loan by ID
const getLoanById = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id).populate('member_id').populate('items.book_id');
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        res.status(200).json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new loan
const createLoan = async (req, res) => {
    try {
        const { member_id, items, borrowDate, dueDate, returnDate, status } = req.body;
        const newLoan = new Loan({ member_id, items, borrowDate, dueDate, returnDate, status });
        await newLoan.save();
        res.status(201).json(newLoan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing loan
const updateLoan = async (req, res) => {
    try {
        const { member_id, items, borrowDate, dueDate, returnDate, status } = req.body;
        const updatedLoan = await Loan.findByIdAndUpdate(
            req.params.id,
            { member_id, items, borrowDate, dueDate, returnDate, status },
            { new: true, runValidators: true }
        );
        if (!updatedLoan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        res.status(200).json(updatedLoan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a loan
const deleteLoan = async (req, res) => {
    try {
        const deletedLoan = await Loan.findByIdAndDelete(req.params.id);
        if (!deletedLoan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        res.status(200).json({ message: 'Loan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Return a loan: /api/loans/:id/return
const returnLoan = async (req, res) => {
    try {
        // Tìm borrowing record
        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        // Prevent the same borrowing record from being returned more than once
        if (loan.status === 'Returned') {
            return res.status(400).json({ message: 'Loan has already been returned' });
        }

        // Update status thành returned
        loan.status = 'Returned';
        loan.returnDate = new Date();
        await loan.save();

        // Restore book quantity
        if (loan.items && loan.items.length > 0) {
            for (const item of loan.items) {
                await Book.findByIdAndUpdate(item.book_id, {
                    $inc: { availableCopies: item.quantity }
                });
            }
        }

        res.status(200).json({ message: 'Loan returned successfully', loan });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllLoans,
    getLoanById,
    createLoan,
    updateLoan,
    deleteLoan,
    returnLoan
};