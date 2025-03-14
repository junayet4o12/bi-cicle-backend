import { Model } from "mongoose";
import { user_role } from "./user.const";


export type TUserRole = keyof typeof user_role
export interface IUser {
    name: string;
    email: string;
    password: string;
    role: TUserRole;
    profile: string;
    address: string;
    contactNumber: string;
    isBlock: boolean;
    passwordChangedAt: Date;
}

export interface IUserCheckingOptions {
    plainTextPassword?: string;
}
export interface IReturningData {
    isUserExist?: boolean;
    isUserBlocked?: boolean;
    isPasswordMatched?: boolean;
    userData?: IUser;
}


export interface IUserModel extends Model<IUser> {
    checkingUser(payload: string | IUser, checkingOptions: IUserCheckingOptions): Promise<IReturningData>;
    isJwtIssuedBeforePasswordChanged(passwordChangedTimestamp: Date, jwtIssuedTimeStamp: number): boolean;
}

