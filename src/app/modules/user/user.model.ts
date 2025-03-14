import httpStatus from 'http-status';
import { model, Schema } from "mongoose";
import { IReturningData, IUser, IUserCheckingOptions, IUserModel } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";
import AppError from "../../errors/AppError";

const userSchema = new Schema<IUser, IUserModel>({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
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

userSchema.statics.checkingUser = async function (
    payload: string,
    checkingOption: IUserCheckingOptions
) {
    const { plainTextPassword } = checkingOption;


    let userData: IUser | null = null;
    let returningData: IReturningData = {};

    if (typeof payload === 'string') {
        const user = await User.findOne({ id: payload }).select('+password');

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'User not found');
        }
        userData = user;
    } else {
        throw new AppError(httpStatus.BAD_REQUEST, 'Use valid data for User');
    }

    if (!userData) {
        throw new AppError(httpStatus.NOT_FOUND, 'User data is missing');
    }
    returningData.userData = userData
    returningData.isUserExist = !!userData;

    returningData.isUserBlocked = userData.isBlock ?? false
    if (plainTextPassword) {
        const isPasswordMatched = await bcrypt.compare(plainTextPassword, userData.password);
        returningData.isPasswordMatched = isPasswordMatched;
    }

    return returningData;
};

userSchema.statics.isJwtIssuedBeforePasswordChanged = function (passwordChangedTimestamp: Date, jwtIssuedTimeStamp: number) {
    const passwordChangeTime = new Date(passwordChangedTimestamp).getTime()
    const jwtIssuedTime = jwtIssuedTimeStamp * 1000


    return passwordChangeTime > jwtIssuedTime
}


export const User = model<IUser, IUserModel>("User", userSchema)

