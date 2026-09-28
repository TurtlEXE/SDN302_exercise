const express = require('express');
const videoRouter = express.Router();

videoRouter.use(express.json());
videoRouter.use(express.urlencoded({ extended: true }));

videoRouter.route('/')
    .get(async (req, res, next) => {
        try {
            res.status(200).end('Will send all the videos to you!');
        } catch (err) {
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            const { title, date, text, url } = req.body;
            const body = title || req.body.body;

            // Simulate video saving logic
            if (!body || !date || (!text && !url)) {
                throw new Error("Missing required video fields");
            }

            // If the operation was successful, send a success response
            res.status(201).json({ message: "Video saved successfully" });
        } catch (err) {
            // Pass the error to the error-handling middleware
            next(err);
        }
    })
    .put(async (req, res, next) => {
        try {
            res.status(403).end('PUT operation not supported on /videos');
        } catch (err) {
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            res.status(200).end('Deleting all videos');
        } catch (err) {
            next(err);
        }
    });

videoRouter.route('/:id')
    .get(async (req, res, next) => {
        try {
            res.status(200).end('Will send details of the video: ' + req.params.id + ' to you!');
        } catch (err) {
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            res.status(403).end('POST operation not supported on /videos/' + req.params.id);
        } catch (err) {
            next(err);
        }
    })
    .put(async (req, res, next) => {
        try {
            const { title, date, text, url } = req.body;
            const body = title || req.body.body;
            if (!body && !date && !text && !url) {
                throw new Error("Missing fields to update video");
            }
            res.status(200).json('Updating the video: ' + req.params.id + '\nWill update the video: ' + (title || req.body.body || ''));
        } catch (err) {
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        try {
            res.status(200).end('Deleting video: ' + req.params.id);
        } catch (err) {
            next(err);
        }
    });

module.exports = videoRouter;
