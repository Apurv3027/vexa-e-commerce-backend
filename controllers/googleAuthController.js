const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleSignIn = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                status: 400,
                message: "Google token is required",
            });
        }

        // Verify Google ID token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, name, email, picture } = payload;

        // Find existing user by googleId or email
        let user = await User.findOne({ googleId: sub }) || await User.findOne({ email });

        // If user doesn’t exist, create new one
        if (!user) {
            user = await User.create({
                googleId: sub,
                name,
                email,
                picture,
            });
        }

        // Generate JWT
        const jwtToken = jwt.sign({userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).json({
            status: 200,
            message: "Google login successful",
            user,
            token: jwtToken,
        });
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        res.status(500).json({
            status: 500,
            message: "Authentication failed",
            error: error.message,
        });
    }
};