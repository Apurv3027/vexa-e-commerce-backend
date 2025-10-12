const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                status: 404,
                message: "Product not found"
            });
        }

        // Check if user already has a cart
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Check if product already in cart
            const itemIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId
            );

            if (itemIndex > -1) {
                // Update quantity
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Add new item
                cart.items.push({ productId, quantity });
            }

            await cart.save();
        } else {
            // Create new cart
            cart = new Cart({
                userId,
                items: [{ productId, quantity }],
            });
            await cart.save();
        }

        res.status(200).json({
            status: 200,
            message: "Product added to cart successfully",
            cart,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Server Error",
            error: error.message,
        });
    }
};

exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        // The populate() method is used to fetch product details like join method
        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.status(200).json({
                status: 200,
                message: "Cart is empty",
                items: [],
            });
        }

        const cartResponse = {
            _id: cart._id,
            userId: cart.userId,
            items: cart.items.map(item => ({
                _id: item._id,
                quantity: item.quantity,
                product: item.productId
            }))
        };

        res.status(200).json({
            status: 200,
            message: "Cart retrieved successfully",
            cartResponse,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Server Error",
            error: error.message,
        });
    }
};