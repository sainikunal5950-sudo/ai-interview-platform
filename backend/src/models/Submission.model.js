import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CodingQuestion",
            required: true
        },
        code: {
            type: String,
            required: true
        },
        language: {
            type: String,
            required: true
        },
        testCasesPassed: {
            type: Number,
            default: 0
        },
        totalTestCases: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "wrong-answer", "error"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

export const Submission = mongoose.model("Submission", submissionSchema);
