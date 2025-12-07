const razorpay = require("../utils/razorpay.js");
const Payment = require("../models/Payment.js");
const TempPayment = require("../models/TempPayment.js");
const crypto = require("crypto");

exports.createPaymentOrder = async (req, res) => {
    try {
        const { amount, userId } = req.body;

        if (!amount || !userId) {
            return res.status(400).json({
                status: 400,
                message: "Amount and userId are required",
            });
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            notes: { userId }
        };

        const order = await razorpay.orders.create(options);

        await TempPayment.create({
            userId,
            paymentId: order.id,
            clientSecret: order.id,
            amount,
            amountInPaise: order.amount,
            currency: order.currency,
            status: order.status,
            livemode: true,
            createdAt: Date.now(),
        });

        return res.status(200).json({
            status: 200,
            order,
        });

    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json({
            status: 500,
            message: "Order creation failed",
            error: error.message,
        });
    }
};

exports.createPaymentSignature = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id } = req.body;

        if (!razorpay_order_id) {
            return res.status(400).json({
                status: 400,
                message: "Razorpay order id are required",
            });
        } else if (!razorpay_payment_id) {
            return res.status(400).json({
                status: 400,
                message: "Razorpay payment id are required",
            });
        } else if (!razorpay_order_id || !razorpay_payment_id) {
            return res.status(400).json({
                status: 400,
                message: "Razorpay order id and payment id are required",
            });
        }

        const signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        console.log(signature);

        return res.status(200).json({
            status: 200,
            signature,
        });
    } catch (error) {
        console.error("Error creating payment signature:", error);
        res.status(500).json({
            status: 500,
            message: "Failed to create payment signature",
            error: error.message,
        });
    }
}

exports.savePayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                status: 400,
                message: "Missing payment verification fields",
            });
        }

        // Verify the signature
        const sign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (sign !== razorpay_signature) {
            return res.status(400).json({
                status: 400,
                message: "Invalid payment signature",
            });
        }

        const tempData = await TempPayment.findOne({ paymentId: razorpay_order_id });

        if (!tempData) {
            return res.status(404).json({
                status: 404,
                message: "Order not found in temporary records",
            });
        }

        const finalPayment = await Payment.create({
            userId: tempData.userId,
            paymentId: razorpay_payment_id,
            clientSecret: razorpay_order_id,
            amount: tempData.amount,
            amountInPaise: tempData.amountInPaise,
            currency: tempData.currency,
            status: "paid",
            livemode: true,
            createdAt: Date.now(),
        });

        await TempPayment.deleteOne({ paymentId: razorpay_order_id });

        return res.status(201).json({
            status: 201,
            message: "Payment saved successfully",
            payment: finalPayment,
        });

    } catch (error) {
        console.error("Error saving payment:", error);
        res.status(500).json({
            status: 500,
            message: "Failed to save payment",
            error: error.message,
        });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        res.status(200).json({
            status: 200,
            message: "Payment fetched successfully",
            payments,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Failed to fetch payments",
            error: error.message,
        });
    }
};