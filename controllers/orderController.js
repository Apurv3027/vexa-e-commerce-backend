const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Payment = require("../models/Payment");

exports.createOrder = async (req, res) => {
    try {
        const { userId, paymentId } = req.body;

        // Validate incoming data
        if (!userId || !paymentId) {
            return res.status(400).json({
                status: 400,
                message: "userId and paymentId are required"
            });
        }

        // Verify payment exists
        const payment = await Payment.findOne({ paymentId });

        if (!payment) {
            return res.status(404).json({
                status: 404,
                message: "Payment record not found"
            });
        }

        console.log(`payment: ${payment}`);

        // Verify payment was successful
        if (payment.status !== "paid") {
            return res.status(400).json({
                status: 400,
                message: "Payment is not successful"
            });
        }

        // Pull totalAmount from payment to avoid tampering
        const totalAmount = payment.amount;

        // Check cart
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                status: 404,
                message: "Cart not found"
            });
        }

        if (cart.items.length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Cart is empty, cannot create an order"
            });
        }

        // Create order
        const newOrder = new Order({
            userId,
            items: cart.items,
            totalAmount,
            paymentId,
            status: "completed"
        });

        await newOrder.save();

        // Clear cart after order
        await Cart.findOneAndDelete({ userId });

        return res.status(200).json({
            status: 200,
            message: "Order created successfully",
            order: newOrder
        });

    } catch (error) {
        console.error("Create Order Error:", error);

        return res.status(500).json({
            status: 500,
            message: "Internal Server Error while creating order",
            error: error.message
        });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "userId is required"
            });
        }

        const orders = await Order.find({ userId })
            .populate("items.productId")
            .sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return res.status(200).json({
                status: 200,
                message: "No orders found",
                orders: []
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Orders fetched successfully",
            orders,
        });

    } catch (error) {
        console.error("Get User Orders Error:", error);

        return res.status(500).json({
            status: 500,
            message: "Internal Server Error while fetching orders",
            error: error.message
        });
    }
};
