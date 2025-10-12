const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    product_count: {
        type: Number,
        default: 0,
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
}, {
    versionKey: false,
});

module.exports = mongoose.model('Category', CategorySchema);