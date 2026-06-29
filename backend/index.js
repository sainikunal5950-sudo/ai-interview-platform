// 1. IMPORT DOTENV AND CONFIGURE IT FIRST
// We do this immediately at the very top of our starting file.
// This ensures that all environment variables inside the .env file are loaded 
// and available for EVERY other file we import afterwards.
import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});

import connectDB from "./src/db/index.js";

// -------------------------------------------------------------
// CONNECTION POINT: Importing the Express app we configured in src/app.js
// -------------------------------------------------------------
// [IMPORT LINE] Here we import the ready-to-use 'app' object from app.js
import app from "./src/app.js"; 

// 2. CONNECT TO DATABASE AND START THE SERVER
// We call connectDB (which returns a Promise because it is an asynchronous function)
connectDB()
    .then(() => {
        const port = process.env.PORT || 5000;
        
        // [USE LINE] Here we tell our imported Express 'app' to start listening for requests
        app.listen(port, () => {
            console.log(`⚙️ Server is running and listening on port: ${port}`);
        });
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed! Server did not start. Error details:", error);
    });
