const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const seedData = require('./seed');
const Customer = require('./models/Customer');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB().then(async () => {
    try {
        const count = await Customer.countDocuments();
        if (count === 0) {
            console.log('Database empty, performing initial seed...');
            await seedData();
        }
    } catch (err) {
        console.error('Initial seeding check error:', err.message);
    }
});

// Root welcome endpoint
app.get('/', async (req, res) => {
    try {
        res.json({ message: 'Welcome to Practical Exam!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Auth endpoints (both /auth/tokens and /api/auth/tokens supported)
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

// Protected REST API endpoints
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);

// 404 Not Found handler
app.use((req, res) => {
    res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ message: 'Malformed JSON in request body' });
    }
    console.error('Unhandled error:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 9999;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;