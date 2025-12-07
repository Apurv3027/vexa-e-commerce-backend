const express = require("express");
const router = express.Router();
const paymentController = require('../controllers/paymentController.js');

router.post("/create-intent", paymentController.createPaymentOrder);
router.post("/create-payment-signature", paymentController.createPaymentSignature);
router.post("/save-payment", paymentController.savePayment);
router.get("/all", paymentController.getAllPayments);

module.exports = router;