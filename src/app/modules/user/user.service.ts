import { IUser } from "./user.interface"
import { User } from "./user.model"

const createUserIntoDB = async (data: IUser) => {
    data.isBlock = false;
    data.passwordChangedAt = new Date();
    const result = await User.create(data);
    return result
}


export const UserServices = {
    createUserIntoDB
}