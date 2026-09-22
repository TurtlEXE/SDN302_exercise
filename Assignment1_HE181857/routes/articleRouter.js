const express = require('express');
const fs = require('fs');
const path = require('path');

const articleRouter = express.Router();
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

articleRouter.get('/', async (req, res) => {
    try {
        const data = await readDataFromFile();
        res.status(200).json(data.articles);

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

articleRouter.get('/:id', async (req, res) => {
    try {
        const data = await readDataFromFile();
        const article = data.articles.find(a => a.id === parseInt(req.params.id));
        if (article) {
            res.status(200).json(article);
        }
        else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

articleRouter.post('/', async (req, res) => {
    try {
        const { title, content, author, date } = req.body;

        if (!title || !content || !author || !date) {
            return res.status(400).json({ success: false, message: 'Bad request' });

        }

        const data = await readDataFromFile();
        const newArticle = {
            id: data.articles.length > 0 ? Math.max(...data.articles.map(a => a.id)) + 1 : 1,
            ...req.body
        };
        data.articles.push(newArticle);
        await writeDataToFile(data);
        res.status(201).json(newArticle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

articleRouter.put('/:id', async (req, res) => {
    try {
        const data = await readDataFromFile();
        const articleIndex = data.articles.findIndex(a => a.id === parseInt(req.params.id));
        if (articleIndex !== -1) {
            data.articles[articleIndex] = { id: parseInt(req.params.id), ...req.body };
            await writeDataToFile(data);
            res.status(200).json(data.articles[articleIndex]);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

articleRouter.delete('/:id', async (req, res) => {
    try {
        const data = await readDataFromFile();
        const articleIndex = data.articles.findIndex(a => a.id === parseInt(req.params.id));
        if (articleIndex !== -1) {
            const deleteArticle = data.articles.splice(articleIndex, 1);
            await writeDataToFile(data);
            res.status(200).json(deleteArticle[0]);
        }
        else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

articleRouter.get('/:id/comments', async (req, res) => {
    try {
        const data = await readDataFromFile();
        const articleId = parseInt(req.params.id);

        const article = data.articles.find(c => c.id === articleId);
        if (!article) {
            return res.status(404).json({ success: false, message: `Không tìm thấy` });
        }

        const allComment = data.comments.filter(p => p.articleId === articleId);
        res.status(200).json({
            success: true,
            data: {
                ...article,
                comment: allComment
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = articleRouter;