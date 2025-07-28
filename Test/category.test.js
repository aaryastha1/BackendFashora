// const request = require("supertest");
// const app = require("../index"); // your express app
// const mongoose = require("mongoose");
// const Category = require("../models/Category");

// jest.setTimeout(20000);

// describe("Category API", () => {
//   // Keep track of created categories to clean up individually
//   let createdCategoryIds = [];



//   test("POST /api/categories - create category", async () => {
//     const res = await request(app)
//       .post("/api/categories")
//       .field("name", "Test Category");

//     expect(res.statusCode).toBe(201);
//     expect(res.body.success).toBe(true);
//     expect(res.body.data.name).toBe("Test Category");

//     createdCategoryIds.push(res.body.data._id);
//   });

//   test("GET /api/categories - get all categories", async () => {
//     // Create a category to guarantee data exists
//     const category = new Category({ name: "Cat1" });
//     await category.save();
//     createdCategoryIds.push(category._id);

//     const res = await request(app).get("/api/categories");

//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(Array.isArray(res.body.data)).toBe(true);
//     expect(res.body.data.length).toBeGreaterThan(0);
//   });

//   test("GET /api/categories/:id - get category by id", async () => {
//     const category = new Category({ name: "Cat2" });
//     await category.save();
//     createdCategoryIds.push(category._id);

//     const res = await request(app).get(`/api/categories/${category._id}`);

//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.data.name).toBe("Cat2");
//   });

//   test("PUT /api/categories/:id - update category", async () => {
//     const category = new Category({ name: "Cat3" });
//     await category.save();
//     createdCategoryIds.push(category._id);

//     const res = await request(app)
//       .put(`/api/categories/${category._id}`)
//       .send({ name: "Updated Cat3" });

//     expect(res.statusCode).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.data.name).toBe("Updated Cat3");
//   });

// //   test("DELETE /api/categories/:id - delete category", async () => {
// //     const category = new Category({ name: "CatToDelete" });
// //     await category.save();

// //     const res = await request(app).delete(`/api/categories/${category._id}`);

// //     expect(res.statusCode).toBe(200);
// //     expect(res.body.success).toBe(true);
// //     expect(res.body.message).toBe("Category deleted");

// //     // No need to push to createdCategoryIds because it's deleted
// //   });
// });



const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Category = require('../models/Category');  // Adjust path as needed
const categoryRouter = require('../routers/admin/CategoryRouteAdmin'); // Adjust path

const app = express();
app.use(express.json());
app.use('/api/categories', categoryRouter);

describe('Category API', () => {
  // Keep track of created category IDs
  let createdCategoryIds = [];

  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/testdb');
  });

  afterEach(async () => {
    // Delete each created category by its ID
    for (const id of createdCategoryIds) {
      try {
        await Category.findByIdAndDelete(id);
      } catch (err) {
        // Ignore errors if already deleted
      }
    }
    // Reset list after cleanup
    createdCategoryIds = [];
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Path to a valid test image (make sure this file exists)
  const testImagePath = path.resolve(__dirname, 'test-image.jpg');

  it('should create a new category with image upload', async () => {
    const res = await request(app)
      .post('/api/categories')
      .field('name', 'Tops')
      .attach('image', testImagePath);

    if (res.statusCode !== 201) {
      console.log('Response body:', res.body);
    }

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.name).toBe('Tops');
    expect(res.body.data.filepath).toBeDefined();

    createdCategoryIds.push(res.body.data._id);
  });

  it('should get all categories', async () => {
    const category = await Category.create({ name: 'Dresses' });
    createdCategoryIds.push(category._id);

    const res = await request(app).get('/api/categories');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should get category by id', async () => {
    const category = await Category.create({ name: 'Shirts' });
    createdCategoryIds.push(category._id);

    const res = await request(app).get(`/api/categories/${category._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Shirts');
  });

  it('should return 404 for non-existing category', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app).get(`/api/categories/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Category not found');
  });

  it('should update a category with new name and image', async () => {
    const category = await Category.create({ name: 'Jeans' });
    createdCategoryIds.push(category._id);

    const res = await request(app)
      .put(`/api/categories/${category._id}`)
      .field('name', 'New Jeans')
      .attach('image', testImagePath);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('New Jeans');
    expect(res.body.data.filepath).toBeDefined();
  });

  it('should return 404 updating non-existing category', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .put(`/api/categories/${fakeId}`)
      .field('name', 'No Category');

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Category not found');
    
  });
});
