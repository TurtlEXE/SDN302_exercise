const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'HE181857';

const connectDB = require('./config/db');
const classRoutes = require('./routes/classRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const user = {
    id: 1,
    studentId: "HE181857",
    email: "he181857@fpt.edu.vn",
    password: "he181857@123"
};

const loginHandler = (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password || email !== user.email || password !== user.password) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const payload = {
        id: user.id,
        studentId: user.studentId,
        email: user.email
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1h'
    });

    return res.status(200).json({
        message: 'Login successful',
        token: token
    });
};

app.post('/api/auth/login', loginHandler);

app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);

app.use((req, res) => {
    res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 9999;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
