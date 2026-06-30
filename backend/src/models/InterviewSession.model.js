import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["technical", "hr", "system-design"],
            required: true
        },
        questions: [
            {
                question: {
                    type: String,
                    required: true
                }
            }
        ],
        answers: [
            {
                questionIndex: {
                    type: Number,
                    required: true
                },
                answerText: {
                    type: String,
                    required: true
                },
                score: {
                    type: Number,
                    required: true
                },
                feedback: {
                    type: String
                }
            }
        ],
        overallScore: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export const InterviewSession = mongoose.model("InterviewSession", interviewSessionSchema);
