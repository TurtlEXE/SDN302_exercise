const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, 'Subject code is required'],
            unique: true,
            trim: true,
            uppercase: true
        },
        name: {
            type: String,
            required: [true, 'Subject name is required'],
            trim: true
        },
        credits: {
            type: Number,
            required: [true, 'Credits are required'],
            min: [1, 'Credits must be at least 1']
        },
        status: {
            type: String,
            enum: {
                values: ['ACTIVE', 'INACTIVE'],
                message: '{VALUE} is not a valid status'
            },
            default: 'ACTIVE'
        }
    },
    {
        timestamps: true,
        collection: 'subjects'
    }
);

module.exports = mongoose.model('Subject', subjectSchema);
