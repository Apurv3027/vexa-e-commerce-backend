const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db/connection');
require('dotenv').config();

// Import Routes
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Connect to database
connectDB();

// Static folder for image uploads
app.use('/products/uploads', express.static('uploads/products'));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Home screen route
app.get('/', (req, res) => {
    try {
        console.log('Serving health check UI');
        res.status(200).json({
            message: 'Authentication API is running!',
        });

    } catch (error) {
        console.error('Error serving health check UI:', error);
        res.status(500).json({
            message: 'Authentication API is running!',
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    // if (process.env.NODE_ENV != 'Production') {
    //     console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
    // }
});