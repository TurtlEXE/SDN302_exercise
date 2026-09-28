# Exercise 9: Custom Middleware in Express

## 1. Overview & Objectives
Middleware functions in Express have access to the request object (`req`), the response object (`res`), and the `next` function in the application's request-response cycle.
They are essential for tasks like:
- **Request validation** (validating body fields, data types, formats).
- **Authentication & Authorization**.
- **Logging & Parsing**.
- **Error handling**.

---

## 2. Project Structure
```
Exercise_9/
├── app.js                          # Main application (Exercise 5: Modular routers + Separated middlewares)
├── app_exercise1.js                # Exercise 1 standalone app matching docx screenshots
├── package.json
├── README.md
├── middlewares/                    # Separated middlewares folder (Exercise 5)
│   ├── index.js                    # Barrel export for all middlewares
│   ├── validateArticle.js          # Exercise 1: Validates presence of title, date, text
│   ├── validateDate.js             # Exercise 2: Validates date format (YYYY-MM-DD)
│   └── validateTextLength.js       # Exercise 3: Validates text length requirement
├── middleware/                     # Alias folder for compatibility
│   └── index.js
└── routes/
    └── articleRouter.js            # Router utilizing chained custom middlewares
```

---

## 3. Installation & Running

### Install dependencies
```bash
cd Exercises/Exercise_9
npm install
```

### Run Main App (Exercise 5 with modular middlewares)
```bash
npm start
```
Server runs at `http://localhost:3000`.

### Run Exercise 1 Demo (Matching docx screenshot)
```bash
npm run exercise1
```

---

## 4. Testing with Postman

### Test 1: POST `/articles` Valid (Matching Image 3)
- **Method**: `POST`
- **URL**: `http://localhost:3000/articles`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "title": "My Favorite Vacation",
  "date": "2023-06-02",
  "text": "We spent seven days in Italy..."
}
```
- **Expected Status**: `201 Created`
- **Expected Response Body**:
```text
Will add the article: My Favorite Vacation with details: We spent seven days in Italy... and 2023-06-02
```

---

### Test 2: POST `/articles` Missing Fields (Matching Image 4)
- **Method**: `POST`
- **URL**: `http://localhost:3000/articles`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON with missing `text`):
```json
{
  "title": "My Favorite Vacation",
  "date": "2023-06-02"
}
```
- **Expected Status**: `400 Bad Request`
- **Expected Response Body**:
```json
{
  "error": "Missing required fields"
}
```

---

### Test 3: POST `/articles` Invalid Date Format (Exercise 2)
- **Method**: `POST`
- **URL**: `http://localhost:3000/articles`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON with invalid date format):
```json
{
  "title": "My Favorite Vacation",
  "date": "02-06-2023",
  "text": "We spent seven days in Italy..."
}
```
- **Expected Status**: `400 Bad Request`
- **Expected Response Body**:
```json
{
  "error": "Invalid date format. Expected YYYY-MM-DD"
}
```

---

### Test 4: POST `/articles` Short Text (Exercise 3)
- **Method**: `POST`
- **URL**: `http://localhost:3000/articles`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON with text shorter than 10 characters):
```json
{
  "title": "My Favorite Vacation",
  "date": "2023-06-02",
  "text": "Short"
}
```
- **Expected Status**: `400 Bad Request`
- **Expected Response Body**:
```json
{
  "error": "Text must be at least 10 characters long"
}
```
