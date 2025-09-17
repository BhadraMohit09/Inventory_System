const mongoose = require("mongoose");

// Define Stock Movement schema
const stockMovementSchema = new mongoose.Schema({

    // The product this stock movement belongs to (foreign key reference)
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
        required: true 
    },

    // Type of stock movement
    // IN  -> stock added (e.g. purchase, return from customer)
    // OUT -> stock removed (e.g. sale, damage, issue to staff)
    // ADJUST -> manual correction to set stock
    type: { 
        type: String, 
        enum: ["IN", "OUT", "ADJUST"], 
        required: true 
    },

    // Quantity of stock moved
    qty: { 
        type: Number, 
        required: true,
        min: [0, "Quantity cannot be negative"]
    },

    // Price per unit at the time of movement (optional)
    unitPrice: { 
        type: Number,
        min: [0, "Unit price cannot be negative"] 
    },

    // Total value of this movement (qty * unitPrice)
    // Automatically calculated in pre-save hook if not provided
    totalValue: { 
        type: Number 
    },

    // External reference ID (e.g. invoice number, order ID, GRN number)
    reference: { 
        type: String 
    },

    // Free-text notes or remarks (e.g. "damaged items removed")
    remarks: { 
        type: String 
    },

    // Location or warehouse name/code (for multi-warehouse support)
    location: { 
        type: String 
    },

    // Status of the stock movement
    // pending   -> awaiting approval
    // confirmed -> finalized
    // cancelled -> invalid / reversed
    status: { 
        type: String, 
        enum: ["pending", "confirmed", "cancelled"], 
        default: "confirmed" 
    },

    // User who performed this stock movement (foreign key reference)
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }

}, { 
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Middleware: Auto-calc totalValue before saving if not explicitly set
stockMovementSchema.pre("save", function (next) {
    if (this.unitPrice && this.qty) {
        this.totalValue = this.unitPrice * this.qty;
    }
    next();
});

// Export StockMovement model
module.exports = mongoose.model("StockMovement", stockMovementSchema);
