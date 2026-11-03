const mongoose = require('mongoose');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

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

        const attendances = await Attendance.find({ studentId })
            .populate({
                path: 'classId',
                populate: {
                    path: 'subjectId'
                }
            })
            .sort({ date: -1 });

        const result = attendances.map((item) => ({
            className: item.classId ? item.classId.className : '',
            subjectName: item.classId && item.classId.subjectId ? item.classId.subjectId.name : '',
            date: item.date,
            status: item.status
        }));

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
