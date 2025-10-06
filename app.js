const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

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
    if (process.env.NODE_ENV != 'Production') {
        console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
    }
});