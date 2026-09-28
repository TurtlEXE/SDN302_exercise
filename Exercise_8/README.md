# Exercise 8: Handling Errors in Express

## 1. Overview & Objectives
In an Express application, handling errors efficiently is crucial for maintaining a good user experience and simplifying debugging. Error handling typically involves catching errors when they occur and sending appropriate responses to the client.

- **Error Propagation**: By calling `next(err)`, we pass the error to the next error-handling middleware in the stack. This allows centralized error handling.
- **Error-handling Middleware**: The function with the signature `(err, req, res, next)` is designed to catch any errors passed via `next(err)`. It logs errors (`err.stack`) and sends a generic error response to the client.

---

## 2. Project Structure
```
Exercise_8/
├── app.js                    # Main application (Exercise 2: Modular routers + Centralized error handling)
├── app_exercise1.js          # Direct implementation of Exercise 1 from docx
├── package.json
├── README.md
├── routes/                   # Routers folder (Exercise 2)
│   ├── articleRouter.js      # Article router with next(err) error handling
│   └── videoRouter.js        # Video router with next(err) error handling
└── routers/                  # Alias folder ensuring compatibility
    ├── articleRouter.js
    └── videoRouter.js
```

---

## 3. Installation & Running

### Install dependencies
```bash
cd Exercises/Exercise_8
npm install
```

### Run Exercise 2 (Main App with modular routers)
```bash
npm start
```
Server runs on `http://localhost:3000`.

### Run Exercise 1 (Single-file demo matching docx screenshot)
```bash
npm run exercise1
```

---

## 4. Testing with Postman

### Test 1: POST /articles (Successful Case - Matching Image 2)
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
- **Expected Response**:
```json
{
  "message": "Article saved successfully"
}
```

---

### Test 2: DELETE /articles/1 (Matching Image 3)
- **Method**: `DELETE`
- **URL**: `http://localhost:3000/articles/1`
- **Expected Status**: `200 OK`
- **Expected Response**:
```text
Deleting article: 1
```

---

### Test 3: POST /articles with Missing Fields (Error Handling Case)
- **Method**: `POST`
- **URL**: `http://localhost:3000/articles`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON with missing `text` or `date`):
```json
{
  "title": "My Incomplete Article"
}
```
- **Expected Status**: `500 Internal Server Error`
- **Expected Response**:
```json
{
  "error": "An error occurred, please try again later."
}
```
- **Server Console**: Logs `Error: Missing required article fields` and stack trace.

---

### Test 4: Video Router (Exercise 2)
- **POST /videos** (Success):
  - **URL**: `http://localhost:3000/videos`
  - **Body**:
  ```json
  {
    "title": "Node.js Tutorial",
    "date": "2023-06-02",
    "url": "https://example.com/video1"
  }
  ```
  - **Status**: `201 Created`
  - **Response**: `{ "message": "Video saved successfully" }`

- **POST /videos** (Missing fields error):
  - **Body**: `{ "title": "Node.js Tutorial" }`
  - **Status**: `500 Internal Server Error`
  - **Response**: `{ "error": "An error occurred, please try again later." }`

- **DELETE /videos/1**:
  - **URL**: `http://localhost:3000/videos/1`
  - **Status**: `200 OK`
  - **Response**: `Deleting video: 1`
