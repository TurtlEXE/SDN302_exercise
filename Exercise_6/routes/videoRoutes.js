const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');

// Helper to read db.json
function getDatabase() {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

// Helper to write db.json
function saveDatabase(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

// GET all videos
router.get('/', (req, res) => {
  try {
    const db = getDatabase();
    res.status(200).json(db.videos || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET video by ID
router.get('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const id = parseInt(req.params.id);
    const video = (db.videos || []).find(v => v.id === id);
    if (!video) {
      return res.status(404).send('Video not found');
    }
    res.status(200).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new video
router.post('/', (req, res) => {
  try {
    const db = getDatabase();
    const videos = db.videos || [];
    const maxId = videos.length > 0 ? Math.max(...videos.map(v => v.id)) : 0;
    const newVideo = {
      id: maxId + 1,
      title: req.body.title,
      date: req.body.date || new Date().toISOString().split('T')[0],
      author: req.body.author || 'Anonymous',
      video: req.body.video || '',
      content: req.body.content || '',
      comments: req.body.comments || []
    };
    videos.push(newVideo);
    db.videos = videos;
    saveDatabase(db);
    res.status(201).json(newVideo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a video by ID
router.put('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const id = parseInt(req.params.id);
    const index = (db.videos || []).findIndex(v => v.id === id);
    if (index === -1) {
      return res.status(404).send('Video not found');
    }
    db.videos[index] = {
      ...db.videos[index],
      ...req.body,
      id: db.videos[index].id // preserve ID
    };
    saveDatabase(db);
    res.status(200).json(db.videos[index]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a video by ID
router.delete('/:id', (req, res) => {
  try {
    const db = getDatabase();
    const id = parseInt(req.params.id);
    const index = (db.videos || []).findIndex(v => v.id === id);
    if (index === -1) {
      return res.status(404).send('Video not found');
    }
    const deleted = db.videos.splice(index, 1);
    saveDatabase(db);
    res.status(204).json(deleted);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
