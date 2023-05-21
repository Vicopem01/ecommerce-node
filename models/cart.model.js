const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                // required: [true, "Quantity is required"],
            },
        },
    ],
    total: {
        type: Number,
    },
    status: {
        type: String,
        enum: ["pending", "processing", "delivered", "cancelled"],
        default: "pending",
    },
    address: {
        type: String,
        // required: [, "Address is required"],
    },
    payment: {
        type: String,
        enum: ["cash", "card"],
        default: "cash",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "processing", "completed", "cancelled"],
        default: "pending",
    },
    paymentId: {
        type: String,
    },
    paymentMethod: {
        type: String,
    },
    paymentAmount: {
        type: Number,
    },
    paymentCurrency: {
        type: String,
    },
    paymentCreatedAt: {
        type: Date,
    },
    paymentUpdatedAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },

})

module.exports = mongoose.model("Cart", cartSchema);