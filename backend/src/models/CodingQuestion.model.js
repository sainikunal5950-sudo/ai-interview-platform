import mongoose from "mongoose";

const codingQuestionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true
        },
        testCases: [
            {
                input: {
                    type: String,
                    required: true
                },
                expectedOutput: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

export const CodingQuestion = mongoose.model("CodingQuestion", codingQuestionSchema);
