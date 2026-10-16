# Exercise 14: Mongoose ODM and Schema Validation

## Mục tiêu
Làm quen với Mongoose - thư viện ODM (Object Data Modeling) cho MongoDB và Node.js.
Học cách xây dựng Schema, định nghĩa kiểu dữ liệu, các ràng buộc validation (built-in và custom validator).

## Cấu trúc thư mục
```
Exercise_14/
├── models/
│   └── article.js              # Mongoose Schema & Model Articles
├── app.js                      # Express App + Mongoose connection
├── test-validation-error.js    # Script kiểm tra lỗi validation (Image 5 & 6)
├── test-insert-success.js      # Script kiểm tra thêm dữ liệu thành công (Image 7 & 8)
├── package.json
└── README.md
```

## Schema & Validation trong `models/article.js`
- **title**: `String`, bắt buộc (`required`), độ dài tối thiểu 5 ký tự (`minlength: 5`), tự động cắt khoảng trắng (`trim: true`).
- **date**: `Date`, mặc định `Date.now`, bắt buộc (`required`).
- **text**: `String`, bắt buộc (`required`), custom validator kiểm tra độ dài > 10 ký tự.
- **comments**: Mảng các subdocument gồm `body` (bắt buộc) và `date`.
- **tags**: Mảng chuỗi `[String]`, custom validator kiểm tra mảng không được rỗng (`tags.length > 0`).

## Hướng dẫn chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy test case validation error:
```bash
npm run test:error
```
*Kết quả:* Sẽ bắt được lỗi validation:
- `title: Article title is required.`
- `text: Article text must be longer than 10 characters.`
- `tags: There should be at least 1 tag.`

3. Chạy test case insert thành công:
```bash
npm run test:success
```
*Kết quả:* Article mới được lưu vào database MongoDB `newspapers` với đầy đủ id và trường dữ liệu.

4. Khởi động server Express:
```bash
npm start
```
Server chạy tại `http://localhost:3000`.
- `GET http://localhost:3000/articles` - Xem danh sách bài viết
- `GET http://localhost:3000/test-error` - Kiểm tra validation error trên API
- `GET http://localhost:3000/test-success` - Thêm bài viết hợp lệ mẫu
