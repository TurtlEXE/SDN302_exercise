Trần Nam Anh - HE181857

List API:
GET /articles
Get /articles/:id
POST /articles 
PUT /articles/:id
DELETE /articles/:id

GET /comments
Get /comments/:id
POST /comments 
PUT /comments/:id
DELETE /comments/:id

Article Test
GET /articles
![GET /articles](image.png)
GET /articles/1
![GET /articles/1](image-1.png)
GET /articles/999
![GET /articles/999](image-2.png)

POST /articles
![POST /articles](image-3.png)
POST /articles - Loi thieu du lieu
![POST /articles - thieu du lieu](image-4.png)

PUT /articles/1
![PUT /articles/1](image-5.png)
PUT /article/999
![PUT /articles/999](image-6.png)

/DELETE /articles/1
![DELETE /articles/1](image-7.png)
DELETE /articles/999
![DELETE /articles/999](image-8.png)

Comment test
GET /comments
![alt text](image-9.png)
GET /comments/1
![alt text](image-10.png)
GET /comments/999
![alt text](image-11.png)

POST /comments
![alt text](image-12.png)
POST /comments -  Article  ID không tồn tại 
![alt text](image-13.png)

PUT /comments/1
![alt text](image-14.png)
PUT /comment/999
![alt text](image-15.png)

DELETE /comments/1
![alt text](image-16.png)
DELETE /comments/999
![alt text](image-17.png)

GET /articles/3/comments
![alt text](image-18.png)
GET /articles/1/comments - Không tồn tại article
![alt text](image-19.png)