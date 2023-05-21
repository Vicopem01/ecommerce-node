const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      unique: [true, "Product name must be unique"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    image: {
      type: [String],
      required: [true, "Product image is required"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: ["food", "electronics", "clothing", "furniture", "other"],
      default: "other",
    },
    quantity_available: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: [true, "Product rating is required"],
    },
    reviews: {
      type: [String],
      required: [true, "Product reviews are required"],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sales: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
