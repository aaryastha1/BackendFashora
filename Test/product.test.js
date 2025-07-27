const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category'); // make sure you have this model
const User = require('../models/User'); // make sure you have this model
const productRouter = require('../routers/admin/productRouteAdmin');

const app = express();
app.use(express.json());
app.use('/api/products', productRouter);

describe('Product API', () => {
  let createdProductIds = [];
  let categoryId;
  let userId;

  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/testdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create dummy category and user
    const category = await Category.create({ name: 'Test Category' });
    categoryId = category._id;

    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      phoneNumber: '1234567890',
      password: '123456',
    });
    userId = user._id;
  });

  afterEach(async () => {
    for (const id of createdProductIds) {
      try {
        await Product.findByIdAndDelete(id);
      } catch {
        // ignore errors if already deleted
      }
    }
    createdProductIds = [];
  });

  afterAll(async () => {
    // Clean up
    await Product.deleteMany();
    await Category.findByIdAndDelete(categoryId);
    await User.findByIdAndDelete(userId);
    await mongoose.connection.close();
  });

  it('should fail creating product with missing fields', async () => {
    const res = await request(app).post('/api/products').send({
      name: 'Incomplete Product',
    });
    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Missing field');
  });

  it('should get all products with pagination', async () => {
    const products = await Product.create([
      { name: 'Prod1', price: 10, categoryId, sellerId: userId, description: 'Desc1' },
      { name: 'Prod2', price: 20, categoryId, sellerId: userId, description: 'Desc2' },
    ]);
    products.forEach((p) => createdProductIds.push(p._id));

    const res = await request(app)
      .get('/api/products')
      .query({ page: '1', limit: '10' }); // Pass as strings to be safe

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeGreaterThanOrEqual(2);
    expect(res.body.pagination).toHaveProperty('total');
  });

  it('should return 404 if single product not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app).get(`/api/products/${fakeId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Product not found');
  });

  it('should return 404 updating non-existing product', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app).put(`/api/products/${fakeId}`).send({
      name: 'NoProd',
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Product not found');
  });
});
