const express = require('express');

// Create an instance of the Express application
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.get('/Hello', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
