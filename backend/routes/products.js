const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { auth, permit } = require("../middleware/auth");

// ✅ Create product (admin/staff only)
router.post("/", auth, permit("admin", "staff"), async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ Get all products (all authenticated users)
router.get("/", auth, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Get single product by ID (all authenticated users)
router.get("/:id", auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Update product (admin/staff only)
router.put("/:id", auth, permit("admin", "staff"), async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Product not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ Delete product (admin only)
// Delete product (admin only)
router.delete("/:id", auth, permit("admin"), async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Product not found!",
            });
        }

        res.json({
            success: true,
            message: `Product '${deleted.name}' (SKU: ${deleted.sku}) deleted successfully.`,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            error: err.message,
        });
    }
});


module.exports = router;
