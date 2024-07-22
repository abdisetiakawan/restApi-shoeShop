const express = require("express");
const router = express.Router();
const { Payment, Shoe } = require("../models");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

// Get sales reports
router.get(
  "/sales-report",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const payments = await Payment.findAll({
      where: { status: "Completed" }, // Assuming completed payments are sales
    });
    res.json(payments);
  }
);

// Get stock status
router.get(
  "/stock-status",
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const shoes = await Shoe.findAll();
    res.json(shoes);
  }
);

module.exports = router;
