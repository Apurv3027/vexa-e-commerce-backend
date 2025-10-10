const Product = require("../models/Product");
const path = require('path');

exports.createProduct = async (req, res) => {
    try {

        const { name, price, description, category, quantity } = req.body;

        const imagePath = req.file
            ? `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`
            : null;

        const product = new Product({
            name,
            price,
            description,
            category,
            quantity,
            image: imagePath,
        });

        const savedProduct = await product.save();
        res.status(201).json({
            message: 'Product created successfully',
            product: savedProduct,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            message: 'Products fetched successfully',
            total_products: products.length,
            products,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json({
            message: 'Product fetched successfully',
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, price, description, category, quantity } = req.body;

        const updateData = {
            name,
            price,
            description,
            category,
            quantity,
        };

        if (req.file) {
            updateData.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        res.status(200).json({
            message: 'Product deleted successfully',
            deletedProduct,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};