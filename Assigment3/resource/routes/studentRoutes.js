const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const verifyToken = require('../middleware/verifyToken');

// - GET: /api/students/:studentId/attendances
router.get('/:studentId/attendances', verifyToken, studentController.getAttendancesByStudent);

module.exports = router;
