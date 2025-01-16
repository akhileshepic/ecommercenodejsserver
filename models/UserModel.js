import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Removes leading and trailing whitespace
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures email uniqueness in the database
        lowercase: true, // Converts email to lowercase before saving
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false, // Optional field
        match: [/^\d{10}$/, "Please enter a valid phone number"], // Validates a 10-digit phone number
    },
    token: {
        type: String, // Stores authentication tokens
        required: false,
    },
    lastLogin: {
        type: Date,
        default: null, // Null by default, updated when the user logs in
    },
    role: {
        type: String,
        enum: ["user", "admin"], // Restricts values to "user" or "admin"
        default: "user", // Default role is "user"
    },
    profileImage: {
        type: String,
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active"
    },
    address_details: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'address'
        }
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'cartProduct'
        }
    ],
    orderHistory: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'order'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets the current date and time
    },
});

// Export the User model
const User = mongoose.model("User", UserSchema);
export default User;
