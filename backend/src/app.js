import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Create the Express application
const app = express();

// Configure CORS middleware with custom options
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Configure JSON parser middleware with a 16KB limit
app.use(express.json({ limit: "16kb" }));

// Configure URL-encoded parser middleware with a 16KB limit
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static assets from the public directory
app.use(express.static("public"));

// Configure cookie-parser middleware
app.use(cookieParser());

// Import Routes
import authRouter from "./routes/auth.routes.js";
import resumeRouter from "./routes/resume.routes.js";

// Mount Routes
app.use("/api/v1/users", authRouter);
app.use("/api/v1/resume", resumeRouter);

// Export the app instance
export default app;
