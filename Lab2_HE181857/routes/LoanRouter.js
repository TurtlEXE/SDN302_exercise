const express = require('express');
const loanController = require('../controllers/LoanController');

const router = express.Router();

router.get('/', loanController.getAllLoans);
router.get('/:id', loanController.getLoanById);
router.post('/', loanController.createLoan);
router.put('/:id/return', loanController.returnLoan);
router.post('/:id/return', loanController.returnLoan);
router.put('/:id', loanController.updateLoan);
router.delete('/:id', loanController.deleteLoan);

module.exports = router;