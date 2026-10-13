const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./configs/db');
const bookRoutes = require('./routes/BookRouter');
const memberRoutes = require('./routes/MemberRouter');
const loanRoutes = require('./routes/LoanRouter');
const app = express();

dotenv.config();
connectDB();

app.use(express.json());
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/loans', loanRoutes);

app.get('/',  async (req, res) => {
    try {
        res.send('API is running...');
    } catch (err) {
        res.status(500).send('Server Error');
        console.log(err);
    }
});



const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
