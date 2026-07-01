import { Router } from "express";
import { uploadResume, getAllResumes } from "../controllers/resume.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Route to upload a resume file (field name must be "resume") and perform AI analysis
router.route("/upload").post(verifyJWT, upload.single("resume"), uploadResume);

// Route to get all resumes for the logged-in user
router.route("/my-resumes").get(verifyJWT, getAllResumes);

export default router;
