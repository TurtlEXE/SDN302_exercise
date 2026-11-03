const mongoose = require('mongoose');
require('./Student');
require('./Subject');

const enrollmentSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: [true, 'Student ID is required']
        },
        status: {
            type: String,
            enum: {
                values: ['enrolled', 'dropped'],
                message: '{VALUE} is not a valid enrollment status'
            },
            default: 'enrolled'
        }
    },
    {
        _id: false
    }
);

const classSchema = new mongoose.Schema(
    {
        className: {
            type: String,
            required: [true, 'Class name is required'],
            trim: true
        },
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: [true, 'Subject ID is required']
        },
        lecturerName: {
            type: String,
            required: [true, 'Lecturer name is required'],
            trim: true
        },
        status: {
            type: String,
            enum: {
                values: ['OPEN', 'CLOSED'],
                message: '{VALUE} is not a valid class status'
            },
            default: 'OPEN'
        },
        enrollments: {
            type: [enrollmentSchema],
            default: []
        }
    },
    {
        timestamps: true,
        collection: 'classes'
    }
);

module.exports = mongoose.model('Class', classSchema);
