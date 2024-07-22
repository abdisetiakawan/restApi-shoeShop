const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Admin, Consumer, Seller } = require("../models");

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

// Register Admin
router.post("/register/admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new admin
    const admin = await Admin.create({ name, email, password: hashedPassword });

    // Generate token
    const token = generateToken(admin);

    res.status(201).json({ token, admin });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // Handle Sequelize validation errors
      const errors = error.errors.map((e) => e.message);
      return res.status(400).json({ errors });
    }
    // Handle other errors
    res.status(500).json({ error: error.message });
  }
});

// Register Consumer
router.post("/register/consumer", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email already exists
    const existingConsumer = await Consumer.findOne({ where: { email } });
    if (existingConsumer) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new consumer
    const consumer = await Consumer.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(consumer);

    res.status(201).json({ token, consumer });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // Handle Sequelize validation errors
      const errors = error.errors.map((e) => e.message);
      return res.status(400).json({ errors });
    }
    // Handle other errors
    res.status(500).json({ error: error.message });
  }
});

// Register Seller
router.post("/register/seller", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if email already exists
    const existingSeller = await Seller.findOne({ where: { email } });
    if (existingSeller) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new seller
    const seller = await Seller.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(seller);

    res.status(201).json({ token, seller });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // Handle Sequelize validation errors
      const errors = error.errors.map((e) => e.message);
      return res.status(400).json({ errors });
    }
    // Handle other errors
    res.status(500).json({ error: error.message });
  }
});

// Login User
const loginUser = async (req, res, Model) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await Model.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Login
router.post("/login/admin", (req, res) => {
  loginUser(req, res, Admin);
});

// Consumer Login
router.post("/login/consumer", (req, res) => {
  loginUser(req, res, Consumer);
});

// Seller Login
router.post("/login/seller", (req, res) => {
  loginUser(req, res, Seller);
});

module.exports = router;
