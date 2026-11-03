const mongoose = require('mongoose');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// GET /api/students/:studentId/attendances
exports.getAttendancesByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!studentId || !mongoose.Types.ObjectId.isValid(studentId) || !/^[0-9a-fA-F]{24}$/.test(studentId)) {
            return res.status(400).json({ error: `Invalid studentId: ${studentId}` });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: `Student with id = ${studentId} not found` });
        }

        const attendances = await Attendance.find({ studentId }).populate('classId');

        return res.status(200).json(attendances);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
