const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Product = require('../models/Product');
const favoriteRouter = require('../routers/FavoriteRoutes'); // adjust path

const app = express();
app.use(express.json());
app.use('/api/favorites', favoriteRouter);

describe('Favorite API', () => {
  let user, product, token;

  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/testdb');

    user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phoneNumber : '9860500911',
      favorites: [],
    });
    await user.save();

    product = new Product({
      name: 'Test Product',
      price: 10,
      categoryId: new mongoose.Types.ObjectId(),
      description: 'Test description',
      sellerId: new mongoose.Types.ObjectId(),
      image: '',
    });
    await product.save();

    token = jwt.sign({ _id: user._id }, process.env.SECRET || 'secretkey');
  });

  afterAll(async () => {
    // Reset favorites instead of deleting user
    user.favorites = [];
    await user.save();

    // Optional: reset product if needed
    product.name = 'Test Product';
    await product.save();

    await mongoose.connection.close();
  });


  it('should get all favorites', async () => {
    user.favorites = [product._id];
    await user.save();

    const res = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.favorites)).toBe(true);
    expect(res.body.favorites.length).toBe(1);
    expect(res.body.favorites[0]._id).toBe(product._id.toString());
  });

  it('should fail toggle favorite without auth', async () => {
    const res = await request(app)
      .post('/api/favorites/toggle')
      .send({ productId: product._id.toString() });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('should fail get favorites without auth', async () => {
    const res = await request(app).get('/api/favorites');

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
