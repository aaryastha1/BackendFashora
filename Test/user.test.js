const request = require("supertest");
const app = require("../index"); // Ensure this exports the express app instance
const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


afterAll(async () => {
  await mongoose.disconnect();
});

let authToken;

describe("User Authentication API", () => {
  beforeEach(async () => {
    await User.deleteOne({ email: { $in: ["pompom@example.com", "testuser@example.com"] } });
  });

  describe("POST /api/auth/register", () => {
    test("should fail to register user with missing fields", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "pompom",
          email: "pompom@example.com",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Missing fields");
    });

    test("should fail to register user with existing email", async () => {
      await User.create({
        name: "pompom",
        email: "pompom@example.com",
        phoneNumber: "9812345678",
        password: await bcrypt.hash("pompom", 10),
      });

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "pompom",
          email: "pompom@example.com",
          phoneNumber: "9812345678",
          password: "pompom",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("User exists");
    });

    test("should successfully register user with all valid fields", async () => {
  await User.deleteOne({ email: "awaz@gmail.com" }); // Cleanup to avoid duplicate key errors

  const res = await request(app)
    .post("/api/auth/register")
    .send({
      name: "awaz",
      email: "awaz@gmail.com",
      phoneNumber: "9812345677",
      password: "awaz123",
    });

  console.log("REGISTER RESPONSE", res.body); // Debug output

  expect(res.statusCode).toBe(201);
  expect(res.body.success).toBe(true);
  expect(res.body.message).toBe("User Registered");

  const user = await User.findOne({ email: "awaz@gmail.com" });
  expect(user).toBeTruthy();
  expect(user.name).toBe("awaz");
  expect(user.phoneNumber).toBe("9812345677");
});


    test("should handle server errors during registration", async () => {
      const originalSave = User.prototype.save;
      User.prototype.save = jest.fn().mockRejectedValue(new Error("Database error"));

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "testuser@example.com",
          phoneNumber: "1234567890",
          password: "password123",
        });

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Server error");

      User.prototype.save = originalSave;
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await User.deleteOne({ email: "testuser@example.com" });
      const hashedPassword = await bcrypt.hash("password123", 10);
      await User.create({
        name: "Test User",
        email: "testuser@example.com",
        phoneNumber: "1234567890",
        password: hashedPassword,
      });
    });

    test("should fail to login with missing fields", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "testuser@example.com" });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Missing fields");
    });

    test("should fail to login with non-existent user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("User not found");
    });

    test("should fail to login with incorrect password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "testuser@example.com",
          password: "wrongpassword",
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid credentials");
    });

    test("should successfully login with valid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "testuser@example.com",
          password: "password123",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.token).toEqual(expect.any(String));
      expect(res.body.data).toEqual(
        expect.objectContaining({
          email: "testuser@example.com",
          name: "Test User",
          id: expect.any(String),
        })
      );

      authToken = res.body.token;
    });

    test("should handle server errors during login", async () => {
      const originalFindOne = User.findOne;
      User.findOne = jest.fn().mockRejectedValue(new Error("Database error"));

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "testuser@example.com",
          password: "password123",
        });

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Server error");

      User.findOne = originalFindOne;
    });
  });
});
