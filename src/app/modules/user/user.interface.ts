export interface IUser {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    profile: string;
    address: string;
    contactNumber: string;
    isBlock: boolean;
    passwordChangedAt: Date;
}