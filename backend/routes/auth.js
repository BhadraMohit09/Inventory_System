const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

// Register user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if email already exists
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hash = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({ name, email, password: hash, role });

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Consistent response
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials🤔" });

        // Compare passwords
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials🤔" });

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Consistent response
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Change password
router.put("/change-password", auth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "⚠️ Both old and new passwords are required!"
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "❌ User not found!"
            });
        }

        // Check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "❌ Old password is incorrect 🤔"
            });
        }

        // Check if new password is same as old
        const isSame = await bcrypt.compare(newPassword, user.password);
        if (isSame) {
            return res.status(400).json({
                success: false,
                message: "⚠️ New password cannot be the same as the old password!"
            });
        }

        // Password strength check
        const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPassword.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "⚠️ Password must be at least 8 characters, include uppercase, lowercase, number, and special character!"
            });
        }

        // Hash and save new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({
            success: true,
            message: "✅ Password changed successfully! 🎉🔑"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "⚠️ Error changing password 😢",
            error: err.message
        });
    }
});




module.exports = router;
