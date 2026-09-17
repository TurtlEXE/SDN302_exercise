const express = require('express');
const router = express.Router();

// GET all articles
router.get('/', (req, res) => {
  try {
    res.status(200).end('Will send all the articles to you!');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new article
router.post('/', (req, res) => {
  try {
    res.status(201).end(
      'Will add the article: ' + req.body.title + ' with details: ' + req.body.text + ' and ' + req.body.date
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT on /articles (not supported)
router.put('/', (req, res) => {
  try {
    res.status(403).end('PUT operation not supported on /articles');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE all articles
router.delete('/', (req, res) => {
  try {
    res.status(200).end('Deleting all articles');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET a specific article
router.get('/:id', (req, res) => {
  try {
    res.status(200).end('Will send details of the article: ' + req.params.id + ' to you!');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a specific article (not supported)
router.post('/:id', (req, res) => {
  try {
    res.status(403).end('POST operation not supported on /articles/' + req.params.id);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a specific article
router.put('/:id', (req, res) => {
  try {
    res.write('Updating the article: ' + req.params.id + '\n');
    res.status(200).end(
      'Will update the article: ' + req.body.title + ' with details: ' + req.body.text + ' and ' + req.body.date
    );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a specific article
router.delete('/:id', (req, res) => {
  try {
    res.status(200).end('Deleting article: ' + req.params.id);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
