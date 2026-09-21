const express = require('express');
const app = express();
const port = 3000;

const articleRouter = require('./routes/articleRouter');

app.use('/articles', articleRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});