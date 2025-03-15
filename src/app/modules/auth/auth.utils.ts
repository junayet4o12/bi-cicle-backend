import { TUserRole } from '../user/user.interface';
import jwt, { SignOptions } from 'jsonwebtoken';
export const createToken = (jwtPayload: { name: string, email: string; role: TUserRole }, accessSecret: string, expiresIn: SignOptions["expiresIn"]) => {
    return jwt.sign(jwtPayload, accessSecret, { expiresIn })
}