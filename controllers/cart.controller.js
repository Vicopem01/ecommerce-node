const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

//add products to cart
exports.addProductToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body; // quantity is the number of products to be added to cart
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const cart = await Cart.findOne({ user: _id });

    if (cart) {
      const productExists = cart.products.some((doc) =>
        doc.product.equals(productId)
      );

      if (productExists) {
        // check if the added quantity is greater than the available quantity
        const product = await Product.findById(productId);
        const availableQuantity = product.quantity_available;
        const productInCart = cart.products.find((doc) =>
          doc.product.equals(productId)
        );
        const cartQuantity = productInCart.quantity;
        if (cartQuantity + quantity > availableQuantity) {
          return res.status(400).json({
            error: `Only ${availableQuantity} items are available and you already have ${cartQuantity} items in your cart. For more items, please contact the seller`,
          });
        }

        await Cart.findOneAndUpdate(
          { user: _id, "products.product": productId },
          { $inc: { "products.$.quantity": quantity } }
        );
      } else {
        const newProduct = { quantity, product: productId };
        await Cart.findOneAndUpdate(
          { user: _id },
          { $push: { products: newProduct } }
        );
      }
    } else {
      // check if the added quantity is greater than the available quantity
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(400).json({ error: "Product not found" });
        }
        

      let availableQuantity = product.quantity_available;
      if (quantity > availableQuantity) {
        return res.status(400).json({
          error: `Only ${availableQuantity} items are available. For more items, please contact the seller`,
        });
        }
      const newCart = await new Cart({
        user: _id,
        products: [{ quantity, product: productId }],
      }).save();
    }

    res.status(201).json({
      message: `Product added to cart`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

// Remove product from cart
exports.removeProductFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: "Product id is required" });
    }
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: _id },
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate("products.product", "_id name price quantity slug");

    // check if cart is empty, if yes then delete cart
    if (cart.products.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
    }

    res.status(200).json({ cart });
  } catch (error) {
    next(error);
  }
};

// Get cart
exports.getCart = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const cart = await Cart.findOne({ user: _id })
      .populate("products.product", "_id name price quantity slug")
      .exec();

    res.status(200).json({ cart });
  } catch (error) {
    next(error);
  }
};

// Clear cart
exports.clearCart = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const cart = await Cart.findOneAndDelete({ user: _id });

    res.status(200).json({ cart });
  } catch (error) {
    next(error);
  }
};

// Save address
exports.saveAddress = async (req, res, next) => {
  try {
    const { address } = req.body;
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: _id },
      { address },
      { new: true }
    ).exec();

    res.status(200).json({ cart });
  } catch (error) {
    next(error);
  }
};
