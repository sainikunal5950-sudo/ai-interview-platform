import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        filePath: {
            type: String,
            required: true
        },
        extractedText: {
            type: String
        },
        skills: [String],
        missingSkills: [String],
        score: {
            type: Number,
            default: 0
        },
        suggestions: [String]
    },
    {
        timestamps: true
    }
);

export const Resume = mongoose.model("Resume", resumeSchema);
