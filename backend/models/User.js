const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({

    // Full name of the user
    name: {
        type: String,
        required: true,     // Cannot be empty
        minlength: 2,       // Must be at least 2 characters long
    },

    // Email address (used for login)
    email: {
        type: String,
        required: true,     // Email is mandatory
        unique: true,       // No two users can register with the same email
        match: /.+\@.+\..+/,// Basic regex validation for email format
    },

    // Hashed password (never store raw password)
    password: {
        type: String,
        required: true,     // Password is mandatory
        minlength: 6,       // Minimum password length requirement
    },

    // Role of user (used for authorization)
    role: {
        type: String,
        enum: ['user', 'admin', 'staff'], // Allowed roles only
        default: 'staff', // Default role assigned if none provided
    }

}, { 
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Export User model
module.exports = mongoose.model('User', userSchema);
