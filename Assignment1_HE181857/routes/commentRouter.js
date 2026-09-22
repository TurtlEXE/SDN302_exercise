const express = require('express');
const fs = require('fs');
const path = require('path');

const commentRouter = express.Router();
const dataFilePath = path.join(__dirname, '../data.json');

// Hàm đọc dữ liệu
const readDataFromFile = async () => {
    try {
        const rawData = await fs.promises.readFile(dataFilePath, 'utf8');
        return JSON.parse(rawData);
    } catch (err) {
        throw new Error('Lỗi khi đọc file data.json: ' + err.message);
    }
};

// Hàm ghi dữ liệu
const writeDataToFile = async (data) => {
    try {
        await fs.promises.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        throw new Error('Lỗi khi ghi file data.json: ' + err.message);
    }
};

//Get all
commentRouter.get('/', async (req, res) => {
    try {
        const data = await readDataFromFile();
        res.status(200).json(data.comments);

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

commentRouter.get('/:id', async (req, res) => {
    try {
        const data = await readDataFromFile();
        const comment = data.comments.find(c => c.id === parseInt(req.params.id));
        if (comment) {
            res.status(200).json(comment);
        }
        else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

commentRouter.post('/', async (req, res) => {
    try {
        const { articleId, author, content, date } = req.body;

        const data = await readDataFromFile();

        const articleExists = data.articles.some(c => c.id === parseInt(articleId));
        if (!articleExists) {
            return res.status(404).json({
                success: false,
                message: `Article k ton tai`
            });
        }

        // Tự động sinh ID
        const newId = data.articles.length > 0
            ? Math.max(...data.articles.map(p => p.id)) + 1
            : 1;

        const newComment = {
            id: newId,
            ...req.body
        };

        data.comments.push(newComment);
        await writeDataToFile(data);

        res.status(201).json({
            success: true,
            message: 'Add comment successfully',
            data: newComment
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


commentRouter.put('/:id', async (req, res) => {
    try {
        const data = await readDataFromFile();
        const commentIndex = data.comments.findIndex(a => a.id === parseInt(req.params.id));
        if (commentIndex !== -1) {
            data.comments[commentIndex] = { id: parseInt(req.params.id), ...req.body };
            await writeDataToFile(data);
            res.status(200).json(data.comments[commentIndex]);
        }
        else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

commentRouter.delete('/:id', async (req, res) => {
    try {
        const data = await readDataFromFile();
        const commentIndex = data.comments.findIndex(a => a.id === parseInt(req.params.id));
        if (commentIndex !== -1) {
            const deleteComment = data.comments.splice(commentIndex, 1);
            await writeDataToFile(data);
            res.status(200).json(deleteComment[0]);
        }
        else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = commentRouter;