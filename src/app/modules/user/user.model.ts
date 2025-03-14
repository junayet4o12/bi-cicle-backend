import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
    },
    address: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        enum: ["user", 'admin'],
        default: 'user'
    },
    isBlock: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    const user = this;
    // hashing password and save into db
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds)
    );
    next();
});

// post save middleware / hook
userSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});


export const User = model<IUser>("User", userSchema)