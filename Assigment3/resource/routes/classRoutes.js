const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const verifyToken = require('../middleware/verifyToken');

router.get('/:classId/students', verifyToken, classController.getStudentsByClass);
router.get('/:classId/attendance-summary', verifyToken, classController.getAttendanceSummary);

module.exports = router;
