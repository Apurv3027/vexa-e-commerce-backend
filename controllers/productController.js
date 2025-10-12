const Product = require("../models/Product");
const Category = require("../models/Category");
const path = require('path');

exports.createProduct = async (req, res) => {
    try {

        const { name, price, description, category, quantity, image } = req.body;

        // Check if category exists in Category collection
        const existingCategory = await Category.findOne({
            name: category
        });

        if (!existingCategory) {
            return res.status(400).json({
                status: 400,
                message: "Invalid category. The specified category does not exist."
            });
        }

        const product = new Product({
            name,
            price,
            description,
            category: existingCategory.name,
            quantity,
            image,
        });

        const savedProduct = await product.save();

        // Increment product count in Category
        existingCategory.product_count = (existingCategory.product_count || 0) + 1;
        await existingCategory.save();

        res.status(201).json({
            status: 201,
            message: 'Product created successfully',
            product: savedProduct,
        });
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: error.message
        });
    }
};

// Create product with image upload
// exports.createProduct = async (req, res) => {
//     try {
//         const { name, price, description, category, quantity } = req.body;

//         // Check if category exists in Category collection
//         const existingCategory = await Category.findOne({
//             name: category
//         });

//         if (!existingCategory) {
//             return res.status(400).json({
//                 status: 400,
//                 message: "Invalid category. The specified category does not exist."
//             });
//         }

//         const imagePath = req.file
//             ? `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`
//             : null;

//         const product = new Product({
//             name,
//             price,
//             description,
//             category: existingCategory.name,
//             quantity,
//             image: imagePath,
//         });

//         const savedProduct = await product.save();

//         // Increment product count in Category
//         existingCategory.product_count = (existingCategory.product_count || 0) + 1;
//         await existingCategory.save();

//         res.status(201).json({
//             status: 201,
//             message: 'Product created successfully',
//             product: savedProduct,
//         });
//     } catch (error) {
//         res.status(400).json({
//             status: 400,
//             message: error.message
//         });
//     }
// };

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            status: 200,
            message: 'Products fetched successfully',
            total_products: products.length,
            products,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                status: 404,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Product fetched successfully',
            product,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, price, description, category, quantity, image } = req.body;

        const updateData = {
            name,
            price,
            description,
            quantity,
            image,
        };

        // Validate category if provided
        if (category) {
            const existingCategory = await Category.findOne({
                name: category
            });

            if (!existingCategory) {
                return res.status(400).json({
                    status: 400,
                    message: "Invalid category. The specified category does not exist."
                });
            }
            updateData.category = existingCategory.name;
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
                status: 404,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Product updated successfully',
            product: updatedProduct,
        });
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: error.message
        });
    }
};

// Update product with image upload
// exports.updateProduct = async (req, res) => {
//     try {
//         const { name, price, description, category, quantity } = req.body;

//         const updateData = {
//             name,
//             price,
//             description,
//             quantity,
//         };

//         // Validate category if provided
//         if (category) {
//             const existingCategory = await Category.findOne({
//                 name: category
//             });

//             if (!existingCategory) {
//                 return res.status(400).json({
//                     status: 400,
//                     message: "Invalid category. The specified category does not exist."
//                 });
//             }
//             updateData.category = existingCategory.name;
//         }

//         if (req.file) {
//             updateData.image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
//         }

//         const updatedProduct = await Product.findByIdAndUpdate(
//             req.params.id,
//             updateData,
//             {
//                 new: true,
//             }
//         );

//         if (!updatedProduct) {
//             return res.status(404).json({
//                 status: 404,
//                 message: 'Product not found'
//             });
//         }

//         res.status(200).json({
//             status: 200,
//             message: 'Product updated successfully',
//             product: updatedProduct,
//         });
//     } catch (error) {
//         res.status(400).json({
//             status: 400,
//             message: error.message
//         });
//     }
// };

exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({
                status: 404,
                message: 'Product not found'
            });
        }

        // Decrement product count from the category
        const category = await Category.findOne({
            name: deletedProduct.category
        });

        if (category && category.product_count > 0) {
            category.product_count -= 1;
            await category.save();
        }

        res.status(200).json({
            status: 200,
            message: 'Product deleted successfully',
            deletedProduct,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};