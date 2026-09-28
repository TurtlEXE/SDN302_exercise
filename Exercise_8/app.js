const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routers
const articleRouter = require('./routes/articleRouter');
const videoRouter = require('./routes/videoRouter');

// Mount routers
app.use('/articles', articleRouter);
app.use('/videos', videoRouter);

// Centralized error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging

    // Send a generic error message
    res.status(500).json({ error: "An error occurred, please try again later." });
});

if (require.main === module) {
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

module.exports = app;
