const User = require("../models/user.model");
const Product = require("../models/product.model");

// create a new product by registered user
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      price,
      description,
      image,
      category,
      quantity_available,
      rating,
      reviews,
    } = req.body;

    if (
      !(
        name &&
        price &&
        description &&
        image &&
        category &&
        quantity_available &&
        rating &&
        reviews
      )
    ) {
      return res.status(400).json({
        message: "All input is required",
      });
    }

    const { _id } = req.user;
    const user = await User.findById({
      _id,
    });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const product = await Product.create({
      name,
      price,
      description,
      image,
      category,
      quantity_available,
      rating,
      reviews,
      seller: _id,
    });
    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    // catch  E11000 duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        message:"Product name already exists"
      })
    }
    console.log(error);
    next(error);

  }
};

// get all products uploaded by all users
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    return res.status(200).json({
      message: "All products",
      products,
    });
  } catch (error) {
    next(error);
  }
};

// get all products uploaded by a specific user
exports.getProductsByUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const products = await Product.find({
      seller: id,
    });
    return res.status(200).json({
      message: "Products by user",
      products,
    });
  } catch (error) {
    next(error);
  }
};

// get a specific product by id
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        message: "Product not found",
      });
    }
    return res.status(200).json({
      message: "Product by id",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// update a specific product by id
exports.updateProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      description,
      image,
      category,
      quantity_available,
      rating,
      reviews,
    } = req.body;
    const product = await Product.findByIdAndUpdate(id, {
      name,
      price,
      description,
      image,
      category,
      quantity_available,
      rating,
      reviews,
    });
    if (!product) {
      return res.status(400).json({
        message: "Product not found",
      });
    }
    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// delete a specific product by id by seller only
exports.deleteProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { _id } = req.user;
        const product = await Product
            .findByIdAndDelete(id);
        if (!product) {
            return res.status(400).json({
                message: "Product not found",
            });
        }
        if (product.seller.toString() !== _id.toString()) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        return res.status(200).json({
            message: "Product deleted successfully",
            product,
        });
    } catch (error) {
        next(error);
    }
};


// top 5 products by highest number of ratings
exports.getTopProducts = async (req, res, next) => {
    try {
      // using aggregate function to get top 5 products
        const products = await Product.aggregate([
            {
                $sort: {
                    rating: -1,
                },
            },
            {
                $limit: 5,
            },
        ]);
        return res.status(200).json({
            message: "Top 5 products",
            products,
        });

    } catch (error) {
        next(error);
    }
};

// top 5 products by highest number of reviews
exports.getTopProductsByReviews = async (req, res, next) => {
    try {
      // using aggregate function to get top 5 products
        const products = await Product.aggregate([
            {
                $sort: {
                    reviews: -1,
                },
            },
            {
                $limit: 5,
            },
        ]);
        return res.status(200).json({
            message: "Top 5 products by reviews",
            products,
        });

    } catch (error) {
        next(error);
    }
};

// get all products by category
exports.getProductsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        const products = await Product.find({
            category: category,
        });
        return res.status(200).json({
            message: "Products by category",
            products,
        });
    } catch (error) {
        next(error);
    }
};

// advance search for products
exports.advanceSearch = async (req, res, next) => {
    try {
        const { name, category } = req.query;
        const products = await Product.find({
            name: {
                $regex: name,
                $options: "i",
            },
            category: {
                $regex: category,
                $options: "i",
            },
        });
        return res.status(200).json({
            message: "Advance search",
            products,
        }); 
    } catch (error) {
        next(error);
    }
};

    
// Rate a product only if user has purchased the product
exports.rateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        const { _id } = req.user;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({
        message: "Product not found",
      });
    }
    const order = await Order.findOne({
      "orderItems.product": id,
      "orderItems.user": _id,
    });
    if (!order) {
      return res.status(400).json({
        message: "You have not purchased this product",
      });
    }
    const isRated = order.orderItems.find(
      (item) => item.product.toString() === id.toString()
    ).isRated;
    if (isRated) {
      return res.status(400).json({
        message: "You have already rated this product",
      });
    } 
    const updatedOrderItems = order.orderItems.map((item) => {
      if (item.product.toString() === id.toString()) {
        item.isRated = true;
      }
      return item;
    }
    );
      
    const updatedOrder = await Order.findByIdAndUpdate(
      order._id,
      {
        orderItems: updatedOrderItems,
      },
      { new: true }
    );
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $push: {
          ratings: {
            user: _id,
            rating,
          },
        },
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Product rated successfully",
      product: updatedProduct,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
