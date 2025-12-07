const express = require("express");
const router = express.Router();
const { createOrder, getUserOrders } = require("../controllers/orderController");

router.post("/create-order", createOrder);
router.get("/:userId", getUserOrders);

module.exports = router;