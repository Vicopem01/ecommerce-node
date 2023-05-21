const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
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
        quantity_available: {
          type: Number,
          // required: [true, "Quantity is required"],
        },
      },
    ],
    total: {
      type: Number,
      // required: [true, "Total is required"],
    },
    status: {
      type: String,
      enum: ["pending", "processing", "delivered", "cancelled"],
      default: "pending",
    },
    address: {
      type: String,
      // required: [true, "Address is required"],
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
    paymentExpiresAt: {
      type: Date,
    },
    paymentStatusMessage: {
      type: String,
    },
    paymentReceiptUrl: {
      type: String,
    },
        transaction_id: {
            type: String,
        },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);