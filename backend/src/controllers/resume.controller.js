import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import Groq from "groq-sdk";
import { Resume } from "../models/Resume.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/**
 * @desc    Upload a resume, parse its text, run AI analysis, and save to MongoDB
 * @route   POST /api/v1/resume/upload
 * @access  Private (Requires verifyJWT)
 */
export const uploadResume = asyncHandler(async (req, res) => {
  // Step A - File check
  // Multer populates req.file when it parses a multipart/form-data request.
  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }
  const localFilePath = req.file.path;

  // Step B - Read PDF text FIRST (before uploading to Cloudinary)
  // We read the PDF file from the local path, extract its text content,
  // and keep it in a variable. This must happen before Cloudinary deletes the local file.
  let extractedText = "";
  try {
    const dataBuffer = fs.readFileSync(localFilePath);
    const data = await pdf(dataBuffer);
    extractedText = data.text;
  } catch (error) {
    console.error("PDF text extraction failed:", error);
    // If extraction fails, we fall back to an empty string so the process can still continue.
    extractedText = "";
  }

  // Step C - Upload to Cloudinary
  // Upload the file to Cloudinary for persistent storage and get its URL.
  const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
  if (!cloudinaryResponse || !cloudinaryResponse.url) {
    throw new ApiError(500, "Failed to upload resume to cloud");
  }
  const fileUrl = cloudinaryResponse.url;

  // Step D - AI Analysis using Groq
  // We initialize the Groq client and send the extracted resume text to Llama 3.
  let aiAnalysis = {
    skills: [],
    missingSkills: [],
    score: 0,
    suggestions: ["Could not analyze resume"]
  };

  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyzer. Analyze the given resume text and return ONLY a valid JSON object with these exact fields: skills (array of strings of technologies found in resume), missingSkills (array of important tech skills missing for a software engineer role), score (number from 0 to 100 rating the overall resume quality), suggestions (array of exactly 3 string suggestions to improve the resume). Return absolutely nothing else except the JSON object, no explanation, no markdown backticks, just pure JSON."
        },
        {
          role: "user",
          content: extractedText || "No text could be extracted from this resume"
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    console.log("Groq full response:", JSON.stringify(response, null, 2))

    const responseText = response?.choices?.[0]?.message?.content || ""

    // Remove any markdown backticks (like ```json and ```) before parsing
    let cleanJson = responseText;
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.slice(7);
    }
    if (cleanJson.endsWith("```")) {
      cleanJson = cleanJson.slice(0, -3);
    }
    cleanJson = cleanJson.trim();

    aiAnalysis = JSON.parse(cleanJson);
  } catch (error) {
    console.error("Groq analysis failed:", error);
    // On failure, aiAnalysis keeps the fallback/default values defined above.
  }

  // Step E - Save to MongoDB
  // Store the resume record along with the AI evaluation fields in the database.
  const resume = await Resume.create({
    userId: req.user._id, // Set by the verifyJWT middleware
    fileName: req.file.originalname,
    filePath: fileUrl,
    extractedText: extractedText,
    skills: aiAnalysis.skills || [],
    missingSkills: aiAnalysis.missingSkills || [],
    score: aiAnalysis.score !== undefined ? aiAnalysis.score : 0,
    suggestions: aiAnalysis.suggestions || ["Could not analyze resume"]
  });

  // Step F - Return response
  return res
    .status(201)
    .json(new ApiResponse(201, resume, "Resume uploaded and analyzed successfully"));
});

/**
 * @desc    Get all resumes uploaded by the logged-in user
 * @route   GET /api/v1/resume/my-resumes
 * @access  Private (Requires verifyJWT)
 */
export const getAllResumes = asyncHandler(async (req, res) => {
  // Find all resumes matching the logged-in user's ID, sorted by newest first
  const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, resumes, "Resumes fetched successfully"));
});
