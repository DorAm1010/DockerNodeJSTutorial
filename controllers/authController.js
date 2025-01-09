const { StatusCodes } = require("http-status-codes");
const User = require("../models/userModel");
const { UnauthenticatedError, BadRequestError } = require("../errors");

const signUp = async (req, res, next) => {
    try {
        const user = await User.create({ ...req.body });
        req.session.user = user;
        res.status(StatusCodes.CREATED).json({ user: { name: user.name } });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key error (e.g., email or username already exists)
            return res
                .status(StatusCodes.CONFLICT)
                .json({ message: "User already exists with the provided email or username." });
        }
        // Handle validation errors (e.g., missing fields)
        if (error.name === "ValidationError") {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: Object.values(error.errors).map((err) => err.message).join(", ") });
        }
        // General fallback
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Check for missing fields
        if (!email || !password) {
            throw new BadRequestError("Please provide email and password.");
        }

        const user = await User.findOne({ email });

        // Handle case where user doesn't exist
        if (!user) {
            throw new UnauthenticatedError("Invalid credentials.");
        }

        // Check if password matches
        const passCorrect = await user.comparePassword(password);
        if (!passCorrect) {
            throw new UnauthenticatedError("Invalid password.");
        }
        req.session.user = user;
        res.status(StatusCodes.OK).json({ user: { name: user.name } });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signUp,
    login,
};
