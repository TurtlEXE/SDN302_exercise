// Import the Express module
const express = require('express');

// Create an instance of the Express application
const app = express();

// Define a GET route for root (matches Step 4: http://localhost:3000 displaying "Hello, Express!")
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// Define a GET route for /Hello (matches Step 3 code snippet)
app.get('/Hello', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
