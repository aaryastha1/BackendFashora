// const request = require("supertest");
// const mongoose = require("mongoose");
// const app = require("../index");
// const Category = require("../models/Category");

// const baseURL = "/api/admin/category";

// // 🧠 Set this before your app connects
// process.env.MONGO_URI = "mongodb://127.0.0.1:27017/fashora_test";

// beforeAll(async () => {
//   // Nothing to do here — the app connects automatically
// });

// afterAll(async () => {
//   await mongoose.connection.db.dropDatabase();
//   await mongoose.connection.close();
// });

// describe("Category API", () => {
//   let categoryId;

//   test("should create a new category", async () => {
//     const res = await request(app)
//       .post(`${baseURL}`)
//       .field("name", "Test Category");

//     expect(res.statusCode).toBe(201);
//     expect(res.body.success).toBe(true);
//     categoryId = res.body.data._id;
//   });

//   test("should fetch all categories", async () => {
//     const res = await request(app).get(`${baseURL}`);
//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body.data)).toBe(true);
//   });

//   test("should fetch a single category by ID", async () => {
//     const res = await request(app).get(`${baseURL}/${categoryId}`);
//     expect(res.statusCode).toBe(200);
//     expect(res.body.data._id).toBe(categoryId);
//   });

//   test("should update a category", async () => {
//     const res = await request(app)
//       .put(`${baseURL}/${categoryId}`)
//       .field("name", "Updated Category");

//     expect(res.statusCode).toBe(200);
//     expect(res.body.data.name).toBe("Updated Category");
//   });

// });
