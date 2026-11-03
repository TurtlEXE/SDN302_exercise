const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const verifyToken = require('../middleware/verifyToken');

// - GET: /api/classes/:classId/students
router.get('/:classId/students', verifyToken, classController.getStudentsByClass);

// - GET: /api/classes/:classId/attendance-summary
router.get('/:classId/attendance-summary', verifyToken, classController.getAttendanceSummary);

module.exports = router;
