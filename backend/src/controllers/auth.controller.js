import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
    // 1. Get name, email, password from request body
    const { name, email, password } = req.body;

    // 2. Validate that none of the fields are empty
    if (!name || !email || !password || name.trim() === "" || email.trim() === "" || password.trim() === "") {
        throw new ApiError(400, "All fields (name, email, password) are required");
    }

    // 3. Check if a user with this email already exists
    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // 4. Save the user to the database
    // NOTE FOR BEGINNERS:
    // We already set up a pre-save hook in User.model.js to hash the password.
    // If we hash it here in the controller first, and then call User.create(),
    // the pre-save hook will hash the already-hashed password a second time.
    // Therefore, we let Mongoose handle the hashing automatically under the hood!
    const user = await User.create({
        name,
        email,
        password // Plain text password (gets hashed automatically by model pre-save hook)
    });

    // 5. Fetch the created user back from the database but exclude the password field
    const createdUser = await User.findById(user._id).select("-password");

    // 6. Check if user creation was successful
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // 7. Return success response
    return res
        .status(201)
        .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

/**
 * @desc    Login existing user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
    // 1. Get email and password from request body
    const { email, password } = req.body;

    // 2. Validate both fields are present
    if (!email || !password || email.trim() === "" || password.trim() === "") {
        throw new ApiError(400, "Email and password are required");
    }

    // 3. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // 4. Compare the entered password with the stored hashed password
    // We use bcryptjs.compare() to check if they match
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // 5. Generate a JWT token containing the user's _id
    const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET || "fallback_secret_key",
        { expiresIn: "7d" }
    );

    // 6. Fetch the logged in user details again but exclude the password field
    const loggedInUser = await User.findById(user._id).select("-password");

    // 7. Return success response with user details and token
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, token },
                "User logged in successfully"
            )
        );
});
