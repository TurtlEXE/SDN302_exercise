# Exercise 17: Applying Model-View-Controller (MVC) Pattern

## Mục tiêu
Áp dụng mô hình thiết kế **Model-View-Controller (MVC)** để tái cấu trúc và phân tách rõ ràng trách nhiệm của ứng dụng:
- **Model**: Định nghĩa Schema, quan hệ và tương tác cơ sở dữ liệu MongoDB (`Article`, `Comment`).
- **Controller**: Chứa toàn bộ business logic xử lý request/response, validation, CRUD dữ liệu (`articleController.js`, `commentController.js`).
- **Routes**: Chỉ chịu trách nhiệm định tuyến URL và ánh xạ HTTP methods tới các controller tương ứng (`articleRouter.js`, `commentRouter.js`).

## Cấu trúc thư mục
```
Exercise_17/
├── models/
│   ├── article.js              # Model Article
│   └── comment.js              # Model Comment (ref 'Articles')
├── controllers/
│   ├── articleController.js    # Business logic cho Article (findAll, create, update, delete, findById)
│   └── commentController.js    # Business logic cho Comment (findAll, create, update, delete, findById)
├── routes/
│   ├── articleRouter.js        # Đăng ký routes gọi articleController
│   └── commentRouter.js        # Đăng ký routes gọi commentController
├── app.js                      # Express App chính kết nối MongoDB
├── test.http                   # File mẫu request HTTP kiểm thử
├── package.json
└── README.md
```

## Các phương thức trong `articleController.js`
- `findAll(req, res)`: `Article.find()` -> `res.json(articles)`
- `create(req, res)`: `new Article(req.body).save()` -> `res.status(201).json(article)`
- `update(req, res)`: `Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })`
- `delete(req, res)`: `Article.findByIdAndDelete(req.params.id)` -> `res.status(204).send()`
- `deleteAll(req, res)`: `Article.deleteMany({})` -> `res.status(200).send(...)`
- `findById(req, res)`: `Article.findById(req.params.id)` -> `res.json(article)`

## Hướng dẫn chạy và kiểm thử

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
- `POST http://localhost:3000/articles`: Tạo bài viết mới.
- `GET http://localhost:3000/articles`: Lấy danh sách bài viết.
- `GET http://localhost:3000/articles/:id`: Lấy chi tiết bài viết.
- `PUT http://localhost:3000/articles/:id`: Cập nhật bài viết với kiểm tra validator (`runValidators: true`).
- `POST http://localhost:3000/comments`: Tạo bình luận liên kết tới bài viết qua `article: "<article_id>"`.
- `GET http://localhost:3000/comments`: Lấy danh sách bình luận kèm populated article.
- `DELETE http://localhost:3000/articles/:id`: Xóa bài viết (trả về `204 No Content`).
