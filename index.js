require("dotenv").config();
const express = require("express");
const connectDB = require("./database/db");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes")
const orderRoutes = require("./routes/order.routes")
const app = express();

const port = process.env.PORT || 6767;
connectDB();

app.use(express.json());


app.get("/", (req, res) => {
    return res.status(200).json("Hello World");
});

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/order", orderRoutes);


app.all("*", (req, res) => {
    return res.status(404).json("Page not found");
});


// 404 handler
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

// Error handler
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
