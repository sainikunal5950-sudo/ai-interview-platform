import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // 1. Get the token from cookies or the Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // 2. If no token is found, throw 401 Unauthorized
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // 3. Verify the token using jsonwebtoken and secret key
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");

        // 4. Find the user by ID and exclude password field
        const user = await User.findById(decodedToken?._id).select("-password");

        // 5. If no user is found with this ID, token is invalid
        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }

        // 6. Attach user to request object and pass control to next middleware/handler
        req.user = user;
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
