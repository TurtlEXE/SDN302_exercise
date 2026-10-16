# Exercise 16: Mongoose Population

## Mục tiêu
Hiểu và áp dụng kỹ thuật **Population** trong Mongoose:
- Tách mô hình quan hệ giữa bài viết (`Article`) và bình luận (`Comment`) sang 2 collection riêng biệt thay vì nhúng (embedded).
- Thiết lập trường tham chiếu `article: { type: mongoose.Schema.Types.ObjectId, ref: 'Articles' }`.
- Sử dụng phương thức `.populate('article')` để tự động thay thế `ObjectId` bằng toàn bộ document `Article` liên quan (tương tự thao tác JOIN trong SQL).

## Cấu trúc thư mục
```
Exercise_16/
├── models/
│   ├── article.js              # Model Article (đã tách comments)
│   └── comment.js              # Model Comment với tham chiếu ref 'Articles'
├── routes/
│   ├── articleRouter.js        # Routes CRUD cho Article
│   └── commentRouter.js        # Routes cho Comment (có .populate('article'))
├── app.js                      # Express App kết nối MongoDB newspapers
├── test.http                   # Mẫu request kiểm thử
├── package.json
└── README.md
```

## Các bước thực hiện & Kiểm thử (theo đúng tài liệu bài tập)

1. Cài đặt thư viện:
```bash
npm install
```

2. Khởi động server:
```bash
npm start
```
Server chạy tại `http://localhost:3000`.

3. Kiểm thử với Postman hoặc `test.http`:
- **Bước 1**: Gửi `POST http://localhost:3000/articles` để tạo 1 bài viết mới.
- **Bước 2**: Copy `_id` của bài viết vừa tạo (ví dụ: `65e91bfa4b2269784e613dd2`).
- **Bước 3**: Gửi `POST http://localhost:3000/comments` với body:
  ```json
  {
      "body": "Absolutely love this guide! Can't wait to explore these places.",
      "article": "65e91bfa4b2269784e613dd2"
  }
  ```
- **Bước 4**: Gửi `GET http://localhost:3000/comments`.
  *Kết quả trả về*: Comment sẽ chứa toàn bộ thông tin chi tiết của bài viết trong object `article` nhờ Mongoose population:
  ```json
  [
    {
      "_id": "...",
      "body": "Absolutely love this guide! Can't wait to explore these places.",
      "article": {
        "_id": "65e91bfa4b2269784e613dd2",
        "title": "Exploring the Hidden Gems of Paris",
        "text": "Paris is known for its iconic landmarks...",
        "tags": ["Paris", "Travel", "Guide"],
        "date": "..."
      },
      "date": "..."
    }
  ]
  ```
