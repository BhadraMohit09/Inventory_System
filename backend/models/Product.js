const mongoose = require("mongoose");

// Define Product schema
const productSchema = new mongoose.Schema({

    // SKU (Stock Keeping Unit) - unique identifier for each product
    sku: {
        type: String,
        required: true,
        unique: true,   // No two products can have the same SKU
        trim: true
    },

    // Product name
    name: {
        type: String,
        required: true,
        minlength: [2, "Product name must be at least 2 characters long"],
        trim: true
    },

    // Category of product (e.g. Stationery, Electronics)
    category: {
        type: String,
        required: true,
        trim: true
    },

    // Optional product description
    description: { 
        type: String,
        trim: true
    },

    // Current stock level (auto starts from 0)
    stock: {
        type: Number,
        default: 0,
        min: [0, "Stock cannot be negative"]
    },

    // Price per unit
    unitPrice: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
    },

    // Minimum stock threshold (used to trigger alerts/reorder)
    minStock: {
        type: Number,
        default: 0,
        min: [0, "Minimum stock cannot be negative"]
    }

}, { 
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model("Product", productSchema);
