const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    name: String,
    email: {
        type: String,
        unique: true,
        sparse: true,
    },
    picture: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    versionKey: false,
});

module.exports = mongoose.model("User", userSchema);