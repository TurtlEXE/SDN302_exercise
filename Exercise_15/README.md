# Exercise 15: RESTful API with Node app and MongoDB, Mongoose

## Mục tiêu
Xây dựng RESTful API hoàn chỉnh sử dụng Express và Mongoose cho tài nguyên `Articles`:
- Hỗ trợ các phương thức HTTP: GET, POST, PUT, DELETE.
- Cấu trúc router dạng module hóa bằng `express.Router()`.
- Xử lý các HTTP Status Code chuẩn: `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`.

## Cấu trúc thư mục
```
Exercise_15/
├── models/
│   └── article.js              # Model Article Mongoose
├── routes/
│   └── articleRouter.js        # Express Router xử lý RESTful endpoints /articles
├── app.js                      # Main Express server & MongoDB connection
├── test.http                   # File mẫu request HTTP cho Postman / REST Client
├── package.json
└── README.md
```

## Danh sách API Endpoints

| Method | Endpoint | Mô tả | Mã trả về |
|---|---|---|---|
| `GET` | `/articles` | Lấy danh sách tất cả các bài viết | `200 OK` |
| `POST` | `/articles` | Thêm mới 1 bài viết | `201 Created` / `400 Bad Request` |
| `PUT` | `/articles` | Cấm cập nhật trên toàn bộ collection | `403 Forbidden` |
| `DELETE` | `/articles` | Xóa tất cả các bài viết | `200 OK` |
| `GET` | `/articles/:id` | Lấy thông tin bài viết theo `id` | `200 OK` / `404 Not Found` |
| `POST` | `/articles/:id` | Cấm tạo mới với `id` cụ thể | `403 Forbidden` |
| `PUT` | `/articles/:id` | Cập nhật thông tin bài viết theo `id` | `200 OK` / `404 Not Found` |
| `DELETE` | `/articles/:id` | Xóa 1 bài viết theo `id` | `204 No Content` / `404 Not Found` |

## Hướng dẫn chạy và kiểm thử

1. Cài đặt dependencies:
```bash
npm install
```

2. Khởi động server:
```bash
npm start
```
Server chạy tại `http://localhost:3000`.

3. Kiểm thử với Postman hoặc file `test.http`:
- **POST http://localhost:3000/articles**: Thêm bài viết mới (mẫu body có sẵn trong `test.http`).
- **GET http://localhost:3000/articles**: Lấy danh sách bài viết.
- **GET http://localhost:3000/articles/:id**: Lấy chi tiết bài viết vừa tạo.
- **PUT http://localhost:3000/articles/:id**: Cập nhật tiêu đề bài viết.
- **DELETE http://localhost:3000/articles/:id**: Xóa bài viết.
