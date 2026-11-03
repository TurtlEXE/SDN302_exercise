const mongoose = require('mongoose');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');

// GET /api/classes/:classId/students?status=enrolled
exports.getStudentsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { status } = req.query;

        // 1. Validate classId as a valid ObjectId. Return 400 if invalid.
        if (!classId || !mongoose.Types.ObjectId.isValid(classId) || !/^[0-9a-fA-F]{24}$/.test(classId)) {
            return res.status(400).json({ error: `Invalid classId: ${classId}` });
        }

        // 2. Return 404 if class is not found.
        const foundClass = await Class.findById(classId).populate('enrollments.studentId');
        if (!foundClass) {
            return res.status(404).json({ error: `Class with id = ${classId} not found` });
        }

        // 3. Only accept valid status values: enrolled or dropped. Return 400 if missing or invalid.
        if (!status || (status !== 'enrolled' && status !== 'dropped')) {
            return res.status(400).json({ error: `Invalid status: ${status}` });
        }

        // 4. Output fields: id (renamed from _id), studentCode, fullName, email.
        const matchingStudents = (foundClass.enrollments || [])
            .filter((enrollment) => enrollment.status === status && enrollment.studentId)
            .map((enrollment) => {
                const s = enrollment.studentId;
                return {
                    id: s._id.toString(),
                    studentCode: s.studentCode,
                    fullName: s.fullName,
                    email: s.email
                };
            });

        return res.status(200).json(matchingStudents);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// GET /api/classes/:classId/attendance-summary
exports.getAttendanceSummary = async (req, res) => {
    try {
        const { classId } = req.params;

        if (!classId || !mongoose.Types.ObjectId.isValid(classId) || !/^[0-9a-fA-F]{24}$/.test(classId)) {
            return res.status(400).json({ error: `Invalid classId: ${classId}` });
        }

        const foundClass = await Class.findById(classId);
        if (!foundClass) {
            return res.status(404).json({ error: `Class with id = ${classId} not found` });
        }

        const attendances = await Attendance.find({ classId }).populate('studentId');

        return res.status(200).json({
            classId: foundClass._id,
            className: foundClass.className,
            totalRecords: attendances.length,
            attendances: attendances
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
