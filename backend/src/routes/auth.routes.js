import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Protected routes
router.route("/current-user").get(verifyJWT, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
        message: "You are authenticated!"
    });
});

export default router;
