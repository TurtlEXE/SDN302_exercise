const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        studentCode: {
            type: String,
            required: [true, 'Student code is required'],
            unique: true,
            trim: true,
            uppercase: true
        },
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true
        }
    },
    {
        timestamps: true,
        collection: 'students'
    }
);

module.exports = mongoose.model('Student', studentSchema);
