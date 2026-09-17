// app.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware for parsing application/json and application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dataFilePath = path.join(__dirname, 'data.json');

// GET /data - Read data from data.json
app.get('/data', (req, res) => {
  try {
    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(rawData);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error reading data file', error: err.message });
  }
});

// POST /update - Update data.json with new content
app.post('/update', (req, res) => {
  try {
    const newData = req.body;
    fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), 'utf8');
    res.status(200).json({ message: 'The data has been updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating data file', error: err.message });
  }
});

// Ex 2 CRUD articles
const articleRoutes = require('./routes/articleRoutes');
const textDemoRoutes = require('./routes/textDemoRoutes');

// Mount Article CRUD Router
app.use('/articles', articleRoutes);

// Also handle /article/:id (used in image 23 & image 28 for delete)
app.delete('/article/:id', (req, res, next) => {
  req.url = `/${req.params.id}`;
  articleRoutes(req, res, next);
});

// Mount text demo router for testing image 3-14 responses
app.use('/demo-articles', textDemoRoutes);

// Ex 3 CRUD videos
const videoRoutes = require('./routes/videoRoutes');

// Mount Video CRUD Router
app.use('/videos', videoRoutes);
app.delete('/video/:id', (req, res, next) => {
  req.url = `/${req.params.id}`;
  videoRoutes(req, res, next);
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Exercise 6: Node and Express API Server',
    exercises: {
      'Exercise 1 (JSON File Handling)': {
        'GET /data': 'Read contents of data.json',
        'POST /update': 'Update data.json with request body'
      },
      'Exercise 2 (Articles CRUD Router)': {
        'GET /articles': 'List all articles',
        'GET /articles/:id': 'Get article details by ID',
        'POST /articles': 'Create a new article',
        'PUT /articles/:id': 'Update article by ID',
        'DELETE /articles/:id': 'Delete article by ID',
        'DELETE /article/:id': 'Alias for delete article by ID',
        '/demo-articles': 'Text-response endpoints corresponding to images 3-14'
      },
      'Exercise 3 (Videos CRUD Router from db.json)': {
        'GET /videos': 'List all videos from db.json',
        'GET /videos/:id': 'Get video details by ID',
        'POST /videos': 'Create a new video in db.json',
        'PUT /videos/:id': 'Update video by ID',
        'DELETE /videos/:id': 'Delete video by ID'
      }
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;
