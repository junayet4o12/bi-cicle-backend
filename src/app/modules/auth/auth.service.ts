import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { ILoginUser } from "./auth.interface";
import { TUserRole } from '../user/user.interface';
import { createToken } from './auth.utils';
import config from '../../config';
import jwt, { JwtPayload, SignOptions, } from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';

const loginUser = async (payload: ILoginUser) => {
    const checkUser = await User.checkingUser(payload.email, { plainTextPassword: payload.password });
    const { isUserExist, isUserBlocked, isPasswordMatched, userData } = checkUser;
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }
    if (isUserBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, 'User has blocked')
    }
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Wrong Password!')
    }
    const jwtPayload = {
        email: userData?.email as string,
        role: userData?.role as TUserRole
    }
    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as SignOptions["expiresIn"])
    const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as SignOptions["expiresIn"])
    return {
        accessToken,
        refreshToken,
    }
}

const changePassword = async (user: JwtPayload, payload: { newPassword: string; oldPassword: string }) => {
    const checkUser = await User.checkingUser(user.email, { plainTextPassword: payload.oldPassword })
    const { isUserExist, isUserBlocked, isPasswordMatched, userData } = checkUser;
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }
    if (isUserBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, 'User has blocked')
    }
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Wrong Password!')
    }

    const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds))
    await User.findOneAndUpdate({
        email: user.email,
        role: user.role
    },
        {
            password: newHashedPassword,
            passwordChangedAt: new Date()
        }
    )
    return null
}

const refreshToken = async (token: string) => {
    const decoded = jwt.verify(token, config.jwt_refresh_secret as string) as JwtPayload;
    const { email, iat } = decoded;

    const checkUser = await User.checkingUser(email, {})
    const { isUserExist, isUserBlocked, userData } = checkUser;
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }
    if (isUserBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, 'User has blocked')
    }
    if (userData?.passwordChangedAt && User.isJwtIssuedBeforePasswordChanged(userData?.passwordChangedAt, iat as number)) {

        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized')

    }

    const jwtPayload = {
        email: userData?.email as string,
        role: userData?.role as TUserRole
    }
    const accessToken = createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as SignOptions["expiresIn"])
    return { accessToken }
}

const forgetPassword = async (email: string) => {

    const checkUser = await User.checkingUser(email, {})
    const { isUserExist, isUserBlocked, userData } = checkUser;

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }

    if (isUserBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, 'User has blocked')
    }
    const jwtPayload = {
        email: userData?.email as string,
        role: userData?.role as TUserRole
    }
    const resetToken = createToken(jwtPayload, config.jwt_access_secret as string, '600s')

    const resetUILink = `${config.frontend_url}/auth/reset-password?email=${userData?.email}&token=${resetToken}`

    sendEmail(userData?.email as string, `Reset your password within 10 mins`, resetUILink)
}

const resetPassword = async (payload: {
    email: string;
    newPassword: string;
}, token: string) => {

    const checkUser = await User.checkingUser(payload.email, {})
    const { isUserExist, isUserBlocked, userData } = checkUser;

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }
    if (isUserBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, 'User has blocked')
    }

    const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload

    const { email, role, iat } = decoded;
    if (email !== payload.email) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!')
    }



    if (!decoded || !decoded.exp) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
    }

    // Manual expiration check
    const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds))

    await User.findOneAndUpdate({
        email: email,
        role: role
    },
        {
            password: newHashedPassword,
            passwordChangedAt: new Date()
        }
    )
}


export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
}