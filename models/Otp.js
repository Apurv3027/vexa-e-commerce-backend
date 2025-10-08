const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    phoneNumber: String,
    otp: String,
    createdAt: { type: Date, default: Date.now, index: { expires: 300 } } // expires in 5 min
});

module.exports = mongoose.model("Otp", otpSchema);