const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: { 
        type: Date,
        default: Date.now,
        index: {
            // expires in 5 min
            expires: 300 
        }
    }
}, {
    versionKey: false,
});

module.exports = mongoose.model("Otp", otpSchema);