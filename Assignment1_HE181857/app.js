const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const articleRouter = require('./routes/articleRouter');
const commentRouter = require('./routes/commentRouter');
// Router get kiểm tra xem server có đang chạy hay không
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

// Gắn userRouter vào đường dẫn /api/users
app.use('/articles', articleRouter);
app.use('/comments', commentRouter);

// Trường hợp không tìm thấy route, trả về lỗi 404
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});