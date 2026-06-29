# AI Interview Platform - Backend

This is the backend server portion of the AI Interview Platform built using the MERN stack (MongoDB, Express, React, Node.js).

## 📁 Directory Structure

```text
backend/
├── public/                # Static files (images, files, etc.)
├── src/
│   ├── config/            # External settings and configurations
│   ├── controllers/       # Business logic for endpoints (request handlers)
│   ├── db/                # Database connection modules
│   │   └── index.js
│   ├── middlewares/       # Security, authorization, and utility middlewares
│   ├── models/            # Mongoose Schemas (database structure)
│   ├── routes/            # Route declarations mapping to controllers
│   ├── utils/             # Helper utilities, custom errors, and API responses
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── asyncHandler.js
│   ├── app.js             # Express application configuration
│   └── constants.js       # App-wide constants (e.g. database name)
├── .env                   # Local configuration secret variables (ignored by Git)
├── .env.sample            # Example configuration template for team members
├── .gitignore             # Declares files/folders untracked by Git
├── .prettierignore        # Tells Prettier formatter what files to skip
├── .prettierrc            # Defines project-wide code formatting rules
├── index.js               # App entry point (db connection & server startup)
└── package.json           # Project metadata, scripts, and package dependencies
```

---

## 🛠️ Tech Stack & Dependencies

*   **Node.js**: JavaScript Runtime environment.
*   **Express**: Minimal and flexible Node.js web application framework.
*   **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
*   **CORS**: Middleware to enable Cross-Origin Resource Sharing.
*   **dotenv**: Module to load environment variables from a `.env` file.
*   **nodemon**: Utility that monitors for changes and restarts the server.

---

## 🚀 Quick Start Instructions

1.  **Clone / Download** this backend folder.
2.  Navigate to the `backend/` directory in your terminal:
    ```bash
    cd backend
    ```
3.  Install project dependencies:
    ```bash
    npm install
    ```
4.  Copy the sample environment variables:
    ```bash
    cp .env.sample .env
    ```
5.  Open the newly created `.env` file and replace the placeholder `MONGO_URI` with your actual MongoDB Atlas connection string.
6.  Start the development server with automatic file watching:
    ```bash
    npm run dev
    ```
