const mongoose = require('mongoose');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');

// Lấy danh sách sinh viên theo lớp (mặc định status = enrolled)
exports.getStudentsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const { status = 'enrolled' } = req.query;

        // Kiểm tra ObjectId hợp lệ
        if (!classId || !mongoose.Types.ObjectId.isValid(classId) || !/^[0-9a-fA-F]{24}$/.test(classId)) {
            return res.status(400).json({ error: `Invalid classId: ${classId}` });
        }

        // Tìm lớp học theo id
        const foundClass = await Class.findById(classId).populate('enrollments.studentId');
        if (!foundClass) {
            return res.status(404).json({ error: `Class with id = ${classId} not found` });
        }

        // Validate trạng thái
        if (status !== 'enrolled' && status !== 'dropped') {
            return res.status(400).json({ error: `Invalid status: ${status}` });
        }

        // Lọc theo trạng thái và định dạng dữ liệu trả về
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

// Thống kê điểm danh của cả lớp
exports.getAttendanceSummary = async (req, res) => {
    try {
        const { classId } = req.params;

        // Kiểm tra ObjectId hợp lệ
        if (!classId || !mongoose.Types.ObjectId.isValid(classId) || !/^[0-9a-fA-F]{24}$/.test(classId)) {
            return res.status(400).json({ error: `Invalid classId: ${classId}` });
        }

        // Tìm lớp học theo id
        const foundClass = await Class.findById(classId).populate('enrollments.studentId');
        if (!foundClass) {
            return res.status(404).json({ error: `Class with id = ${classId} not found` });
        }

        // Chỉ thống kê cho sinh viên có trạng thái enrolled
        const enrolledStudents = (foundClass.enrollments || []).filter(
            (e) => e.status && e.status.toLowerCase() === 'enrolled' && e.studentId
        );

        // Lấy danh sách điểm danh của lớp
        const attendances = await Attendance.find({ classId: foundClass._id });

        const summary = enrolledStudents.map((enrollment) => {
            const student = enrollment.studentId;
            const studentAttendances = attendances.filter(
                (a) => a.studentId.toString() === student._id.toString()
            );

            const totalSessions = studentAttendances.length;
            let present = 0;
            let absent = 0;
            let attendanceRate = 0;
            let warning = true;

            // Tính tỉ lệ có mặt và cờ cảnh báo
            if (totalSessions > 0) {
                present = studentAttendances.filter((a) => a.status === 'PRESENT').length;
                absent = studentAttendances.filter((a) => a.status === 'ABSENT').length;
                attendanceRate = Number(((present / totalSessions) * 100).toFixed(1));
                warning = attendanceRate < 80;
            }

            return {
                studentId: student._id.toString(),
                studentCode: student.studentCode,
                fullName: student.fullName,
                totalSessions,
                present,
                absent,
                attendanceRate,
                warning
            };
        });

        return res.status(200).json(summary);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
