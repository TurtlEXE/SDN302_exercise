const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'HE181857';

const connectDB = require('./config/db');
const verifyToken = require('./middleware/verifyToken');

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

// Validate the email password using authentication mechanism /test account config in project
// If either field missing or login credentials incorrect => 401
// If login is suscessfull, gen JWT using pre-installed jwt package
// The JWT payload must contain the user's identification information at least studentId
// Set token expire 1 hour
// Return token in JSON response
// {"message": "Login successful", "token": JWT_TOKEN}
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

// Login endpoint
app.post('/api/auth/login', loginHandler);

// Protect API
// Apply verifyToken middleware to protect all the following enpoint
// - GET: /api/classes/:classId/students
// - GET: /api/classes/:classId/attendance-summary
// - GET: /api/students/:studentId/attendances

// The client must send the JWT in req header
// Authorization: Bearer <JWT_TOKEN>
// Request without valid JWT => 401
app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 9999;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
