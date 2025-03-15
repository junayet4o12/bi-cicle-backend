import jwt, { decode, JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';



const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
        }
        let decoded;
        try {
            decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload
        } catch (err) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!!')
        }
        if (!decode) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!!')
        }

        const { role, email, iat } = decoded;


        const checkUser = await User.checkingUser(email, {})
        const { isUserExist, isUserBlocked,  userData } = checkUser;

        if (!isUserExist) {
            throw new AppError(httpStatus.NOT_FOUND, 'User not found')
        }
        if (isUserBlocked) {
            throw new AppError(httpStatus.FORBIDDEN, 'User has blocked')
        }

        if (requiredRoles && !requiredRoles.includes(role)) {

            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized')
        }
        if (userData?.passwordChangedAt && User.isJwtIssuedBeforePasswordChanged(userData?.passwordChangedAt, iat as number)) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized')

        }
        req.user = decoded as JwtPayload
        next()
    })
}

export default auth;