const express = require("express");
const router = express.Router();
const { Seller, Shoe } = require("../models");
const { authenticateToken, authorizeSeller } = require("../middleware/auth");

// Add a new shoe
router.post("/shoes", authenticateToken, authorizeSeller, async (req, res) => {
  const { SellerId, name, description, price, size, stock, imageUrl } =
    req.body;
  const shoe = await Shoe.create({
    SellerId,
    name,
    description,
    price,
    size,
    stock,
    imageUrl,
  });
  res.json(shoe);
});

// Update shoe stock
router.put(
  "/shoes/:id",
  authenticateToken,
  authorizeSeller,
  async (req, res) => {
    const { stock } = req.body;
    const shoe = await Shoe.findByPk(req.params.id);
    if (shoe) {
      shoe.stock = stock;
      await shoe.save();
      res.json(shoe);
    } else {
      res.status(404).send("Shoe not found");
    }
  }
);

module.exports = router;
