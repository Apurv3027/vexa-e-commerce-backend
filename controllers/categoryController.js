const Category = require('../models/Category');
const Product = require("../models/Product");

exports.createCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json({
            status: 201,
            message: "Category created successfully",
            newCategory,
        });
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            status: 200,
            message: "Categories retrieved successfully",
            total_categories: categories.length,
            categories,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
}

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                status: 404,
                message: "Category not found",
            });
        }

        // Fetch all products by category name
        const products = await Product.find({
            category: category.name
        });
        
        res.status(200).json({
            status: 200,
            message: "Category retrieved successfully",
            category,
            total_products: products.length,
            products,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { 
                new: true,
            }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                status: 404,
                message: "Category not found",
            });
        }

        res.status(200).json({
            status: 200,
            message: "Category updated successfully",
            updatedCategory,
        });
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: error.message,
        });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        if (!deletedCategory) {
            return res.status(404).json({
                status: 404,
                message: "Category not found",
            });
        }

        // Also delete products in this category
        await Product.deleteMany({
            category: deletedCategory.name
        });

        res.status(200).json({
            status: 200,
            message: "Category deleted successfully",
            // deletedCategory,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
}