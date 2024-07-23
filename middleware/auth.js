// Import jwt untuk memverifikasi token JWT
const jwt = require("jsonwebtoken");
// Import model Admin dan Seller dari folder models
const { Admin, Seller } = require("../models");
// Memuat variabel lingkungan dari file .env
require("dotenv").config();

// Middleware untuk mengautentikasi token JWT
const authenticateToken = (req, res, next) => {
  // Mendapatkan token dari header Authorization
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1];
  // Jika token tidak ada, kembalikan respons 401 (Unauthorized)
  if (!token) return res.status(401).json({ message: "Access Token Required" });

  // Memverifikasi token menggunakan secret key
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // Jika token tidak valid, kembalikan respons 403 (Forbidden)
    if (err) return res.status(403).json({ message: "Invalid Token" });
    // Menyimpan informasi pengguna dari token ke dalam request
    req.user = user;
    // Melanjutkan ke middleware berikutnya
    next();
  });
};

// Middleware untuk mengautorisasi admin
const authorizeAdmin = async (req, res, next) => {
  // Memastikan user dan email ada di request
  if (!req.user || !req.user.email) {
    // Jika tidak, kembalikan respons 403 (Forbidden)
    return res.status(403).json({ message: "Access Denied" });
  }

  // Mencari admin berdasarkan email
  const admin = await Admin.findOne({ where: { email: req.user.email } });
  // Jika admin tidak ditemukan, kembalikan respons 403 (Forbidden)
  if (!admin) {
    return res.status(403).json({ message: "Access Denied" });
  }

  // Melanjutkan ke middleware berikutnya
  next();
};

// Middleware untuk mengautorisasi seller
const authorizeSeller = async (req, res, next) => {
  // Memastikan user dan email ada di request
  if (!req.user || !req.user.email) {
    // Jika tidak, kembalikan respons 403 (Forbidden)
    return res.status(403).json({ message: "Access Denied" });
  }

  // Mencari seller berdasarkan email
  const seller = await Seller.findOne({ where: { email: req.user.email } });
  // Jika seller tidak ditemukan, kembalikan respons 403 (Forbidden)
  if (!seller) {
    return res.status(403).json({ message: "Access Denied" });
  }

  // Melanjutkan ke middleware berikutnya
  next();
};

// Mengekspor middleware untuk digunakan di tempat lain
module.exports = { authenticateToken, authorizeAdmin, authorizeSeller };
