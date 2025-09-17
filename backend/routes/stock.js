const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");
const { auth, permit } = require("../middleware/auth");

// Record stock movement
router.post("/move", auth, permit("admin", "staff"), async (req, res) => {
    try {
        const { productId, type, qty, unitPrice, reference, remarks, location } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found!" 
            });
        }

        // Update stock safely
        if (type === "IN") {
            product.stock += qty;
        } else if (type === "OUT") {
            if (product.stock < qty) {
                return res.status(400).json({ 
                    success: false,
                    message: "Insufficient stock available!" 
                });
            }
            product.stock -= qty;
        } else if (type === "ADJUST") {
            product.stock = qty;
        } else {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid stock movement type!" 
            });
        }

        await product.save();

        // Save stock movement
        const movement = await StockMovement.create({
            productId,
            type,
            qty,
            unitPrice,
            reference,
            remarks,
            location,
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            message: `Stock movement (${type}) recorded successfully for '${product.name}' (SKU: ${product.sku}).`,
            product,
            movement
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Error recording stock movement", 
            error: err.message 
        });
    }
});

// Get stock movements (with filters)
router.get("/", auth, async (req, res) => {
    try {
        const { productId, type, from, to } = req.query;
        const filter = {};

        if (productId) filter.productId = productId;
        if (type) filter.type = type;
        if (from && to) {
            filter.createdAt = { $gte: new Date(from), $lte: new Date(to) };
        }

        const movements = await StockMovement.find(filter)
            .populate("productId", "name sku")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: movements.length,
            movements
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Error fetching stock movements", 
            error: err.message 
        });
    }
});

module.exports = router;
