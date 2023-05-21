const User = require("../models/user.model");


exports.userSignUp = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!(firstName && lastName && email && password)) {
            return res.status(400).json({
                message: "All input is required",
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exists",
            });
        }
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
        });

        const token = newUser.generateToken();
        return res.status(201).json({
            message: "User created successfully",
            token,
        });

    } catch (error) {
        next(error);
    }

};


exports.userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).json({
                message: "All input is required",
            });
        }
        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }   

        const isMatch = user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const token = user.generateToken();
        return res.status(200).json({
            message: "Login successful",
            token,
        });
        
    } catch (error) {
        next(error);
    }
};

exports.userProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        return res.status(200).json({
            message: "User profile",
            user,
        });
    } catch (error) {
        next(error);
    }
};

exports.userUpdate = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id,
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }   

        return res.status(200).json({
            message: "User updated successfully",
            user,
        });

    } catch (error) {
        next(error);
    }
};


