// Import MongoClient từ thư viện mongodb
const { MongoClient } = require("mongodb");
// Địa chỉ MongoDB
// 27017 = port mặc định của MongoDB
const url = "mongodb://127.0.0.1:27017";
// Tạo đối tượng MongoClient
const client = new MongoClient(url);
// Hàm main() là nơi chạy chương trình
async function main() {
  try {
    // 1. Kết nối đến MongoDB
    await client.connect();
    console.log("Connected to MongoDB");
    console.log("================================");
    // 2. Chọn database
    // Tên database phải trùng với database đang mở trong MongoDB Compass.
    const db = client.db("se1900_db");
    // 3. Chọn collection students
    const students = db.collection("Students");

    // 4. Kiểm tra tên database
    console.log("Database:", db.databaseName);
    // Có thể sử dụng biến students
    // để thực hiện các thao tác với collection students
    console.log("Collection: Students");

    // 5. Liệt kê tất cả sinh viên
    await listStudents(client, "se1900_db", "Students");


    console.log("==============TEST==================");
    // 6. Thêm một sinh viên mới
    const newStudent = {
      name: "Nguyen Van A",
      age: 20,
      major: "Computer Science",
    };
    await insertStudent(client, "se1900_db", "Students", newStudent);

    // 7. Cập nhật thông tin sinh viên
    const studentIdToUpdate = newStudent._id;
    const updatedFields = { age: 21 };
    await updateStudent(client, "se1900_db", "Students", studentIdToUpdate, updatedFields);

    // 8. Xóa một sinh viên
    await deleteStudent(client, "se1900_db", "Students", studentIdToUpdate);

    // 9. Tìm kiếm sinh viên theo ID
    await findStudentById(client, "se1900_db", "Students", studentIdToUpdate);

  } catch (error) {
    // Nếu kết nối hoặc thao tác bị lỗi
    // thì hiển thị thông báo lỗi
    console.error("Lỗi kết nối MongoDB:", error);
  } finally {
    // 5. Đóng kết nối MongoDB
    await client.close();
    console.log("Đã đóng kết nối MongoDB.");
  }
}

console.log("===============23123=================");

async function listStudents(client, dbName, collectionName) {
    const result = await client.db(dbName).collection(collectionName).find().toArray();
    console.log("Danh sách sinh viên:");
    console.log(result);
}

async function insertStudent(client, dbName, collectionName, student) {
    const result = await client.db(dbName).collection(collectionName).insertOne(student);
    console.log(`Đã thêm sinh viên với _id: ${result.insertedId}`);
}

async function updateStudent(client, dbName, collectionName, studentId, updatedFields) {
    const result = await client.db(dbName).collection(collectionName).updateOne(
        { _id: studentId },
        { $set: updatedFields }
    );
    console.log(`Đã cập nhật ${result.modifiedCount} sinh viên.`);
}

async function deleteStudent(client, dbName, collectionName, studentId) {
    const result = await client.db(dbName).collection(collectionName).deleteOne({ _id: studentId });
    console.log(`Đã xóa ${result.deletedCount} sinh viên.`);
}

async function findStudentById(client, dbName, collectionName, studentId) {
    const student = await client.db(dbName).collection(collectionName).findOne({ _id: studentId });
    if (student) {
        console.log("Thông tin sinh viên:", student);
    } else {
        console.log("Không tìm thấy sinh viên với _id:", studentId);
    }
}
// Gọi hàm main() để chạy chương trình
main();