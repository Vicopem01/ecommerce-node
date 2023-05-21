const User = require("../models/user.model");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// create a new order showing total price of products and user details
exports.createOrder = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById({
      _id,
    });
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // get the cart of the user
    const cart = await Cart.findOne({
      user: _id,
    })
      .populate("products.product", "_id name price quantity slug")
      .exec();

    if (!cart) {
      return res.status(400).json({ error: "Cart not found" });
    }

    // Get the total price of the products in the cart
    const totalPrice = cart.products.reduce((total, product) => {
      return total + product.product.price * product.quantity;
    }, 0);

    // create a random transaction id using current time
    const transactionId = new Date().getTime();

    // create commission
    const commission = (totalPrice * 0.05).toFixed(2);

    // total price
    const total = (totalPrice + Number(commission)).toFixed(2);

    //  track the number of times a product has been sold
    const bulkOption = cart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { sales: +item.quantity } },
        },
      };
    });

    console.log(bulkOption);

    // update the product quantity
    const updated = await Product.bulkWrite(bulkOption, {});

    console.log(updated);


    // create a new order
    const order = await new Order({
      user: _id,
      products: cart.products,
      transaction_id: transactionId,
      amount: total,
      address: user.address,
      payment: "cash",
      paymentStatus: "processing",
      paymentId: transactionId,
      paymentAmount: total,
      paymentCurrency: "NGN",
      paymentCreatedAt: new Date().toISOString(),
      paymentUpdatedAt: "",
      createdAt: Date.now(),
    }).save();

    // clear the cart
    // clear the cart
    // await Cart.findOneAndDelete({
    //   user: _id,
    // });

    res.status(200).json({
      order,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};



