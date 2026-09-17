const express = require('express');
const router = express.Router();
let articles = require('../articles');

// GET all articles
router.get('/', (req, res) => {
  try {
    res.status(200).json(articles);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// GET a specific article by ID
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const article = articles.find(a => a.id === id);
    if (!article) {
      return res.status(404).send('Article not found');
    }
    res.status(200).json(article);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// POST a new article
router.post('/', (req, res) => {
  try {
    const newArticle = {
      id: articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1,
      title: req.body.title,
      date: req.body.date,
      text: req.body.text
    };
    articles.push(newArticle);
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update an article by ID
router.put('/:id', (req, res) => {
  try {
    const index = articles.findIndex(a => a.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).send('Article not found');
    }
    articles[index] = {
      ...articles[index],
      ...req.body,
      id: articles[index].id // keep original ID
    };
    res.status(200).json(articles[index]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an article by ID
router.delete('/:id', (req, res) => {
  try {
    const index = articles.findIndex(a => a.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).send('Article not found');
    }
    const deletedArticle = articles.splice(index, 1);
    res.status(204).json(deletedArticle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
