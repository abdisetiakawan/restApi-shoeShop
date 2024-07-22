const jwt = require("jsonwebtoken");
const { Admin, Seller } = require("../models");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Token Required" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};

const authorizeAdmin = async (req, res, next) => {
  if (!req.user || !req.user.email) {
    return res.status(403).json({ message: "Access Denied" });
  }

  const admin = await Admin.findOne({ where: { email: req.user.email } });
  if (!admin) {
    return res.status(403).json({ message: "Access Denied" });
  }

  next();
};

const authorizeSeller = async (req, res, next) => {
  if (!req.user || !req.user.email) {
    return res.status(403).json({ message: "Access Denied" });
  }

  const seller = await Seller.findOne({ where: { email: req.user.email } });
  if (!seller) {
    return res.status(403).json({ message: "Access Denied" });
  }

  next();
};

module.exports = { authenticateToken, authorizeAdmin, authorizeSeller };
