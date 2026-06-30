import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: "student"
        },
        isPremium: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Apply the mongoose aggregation pagination plugin
userSchema.plugin(mongooseAggregatePaginate);

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to verify/compare password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
