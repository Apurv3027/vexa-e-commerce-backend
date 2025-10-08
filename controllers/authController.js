const twilio = require("twilio");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");
const User = require("../models/User");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Generate Random 6-Digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP
exports.sendOtp = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        if (!phoneNumber) {
            return res.status(400).json({ message: "Phone number required" });
        }

        const otpCode = generateOTP();

        // Save OTP to DB (valid for 5 minutes)
        await Otp.create({ phoneNumber, otp: otpCode });

        // Send SMS via Twilio
        await client.messages.create({
            body: `Your verification code is ${otpCode}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });

        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Failed to send OTP", error: error.message });
    }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        if (!phoneNumber || !otp) {
            return res.status(400).json({ message: "Phone number and OTP required" });
        }

        const otpRecord = await Otp.findOne({ phoneNumber, otp });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // OTP verified — create or find user
        let user = await User.findOne({ phoneNumber });
        if (!user) {
            user = await User.create({ phoneNumber });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, phoneNumber },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Delete OTP after verification
        await Otp.deleteMany({ phoneNumber });

        res.json({
            message: "Login successful",
            user,
            token,
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Failed to verify OTP", error: error.message });
    }
};
