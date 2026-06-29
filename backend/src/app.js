import express from "express";
import cors from "cors";

// 1. Create the Express application
const app = express();

// 2. Set up CORS (Cross-Origin Resource Sharing) middleware
// This allows other websites/frontend applications to send requests to our backend
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*", // Define which domains can access this API
    credentials: true
}));

// 3. Set up JSON parser middleware with a size limit
// This allows our server to read JSON data sent in request bodies (e.g. from forms)
// We set a 16KB limit to prevent malicious users from sending huge JSON payloads and crashing our server
app.use(express.json({ limit: "16kb" }));

// 4. Set up URL-encoded parser middleware with a size limit
// This helps the server understand data sent through URL query parameters or form submissions
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// 5. Serve static files from the public folder (like images, PDFs, etc.)
app.use(express.static("public"));

// Export the app instance so it can be imported in index.js to start the server
export default app;
