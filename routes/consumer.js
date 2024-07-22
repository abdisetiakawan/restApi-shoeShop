const express = require("express");
const router = express.Router();
const { Consumer, Shoe, Payment, PaymentDetail } = require("../models");
const { authenticateToken, authorizeSeller } = require("../middleware/auth");

// Get shoes
router.get("/shoes", async (req, res) => {
  const shoes = await Shoe.findAll();
  res.json(shoes);
});

// Get shoe details
router.get("/shoes/:id", async (req, res) => {
  const shoe = await Shoe.findByPk(req.params.id);
  res.json(shoe);
});

// Create a new payment
router.post("/payments", authenticateToken, async (req, res) => {
  const { status, ConsumerId, shoes, totalAmount, paymentMethod } = req.body;
  const payment = await Payment.create({
    ConsumerId,
    totalAmount,
    paymentMethod,
    status,
  });

  await Promise.all(
    shoes.map(async (shoe) => {
      await PaymentDetail.create({
        PaymentId: payment.id,
        ShoeId: shoe.id,
        quantity: shoe.quantity,
      });
    })
  );

  res.json(payment);
});

module.exports = router;
