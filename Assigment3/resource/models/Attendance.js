const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: [true, 'Student ID is required']
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: [true, 'Class ID is required']
        },
        date: {
            type: Date,
            required: [true, 'Attendance date is required']
        },
        status: {
            type: String,
            required: [true, 'Attendance status is required'],
            enum: {
                values: ['PRESENT', 'ABSENT'],
                message: '{VALUE} is not a valid attendance status'
            }
        }
    },
    {
        timestamps: true,
        collection: 'attendances'
    }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
