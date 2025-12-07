const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    paymentId: { type: String, required: true },
    clientSecret: { type: String, required: true },
    amount: { type: Number, required: true },
    amountInPaise: { type: Number, required: true },
    currency: { type: String, default: "inr" },
    email: { type: String },
    customerName: { type: String },
    status: { type: String, required: true },
    livemode: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now, },
}, {
    versionKey: false,
});

module.exports = mongoose.model("Payment", paymentSchema);