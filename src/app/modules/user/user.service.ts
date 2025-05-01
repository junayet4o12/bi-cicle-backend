import QueryBuilder from "../../builder/QueryBuilder";
import { IUser, TUserRole } from "./user.interface"
import { User } from "./user.model"

const createUserIntoDB = async (data: IUser) => {
    data.isBlock = false;
    data.passwordChangedAt = new Date();
    const result = await User.create(data);
    return result
}

const getAllUserFromDB = async (query: Record<string, unknown>) => {
    const userQuery = new QueryBuilder(User.find(), query).fields().filter().paginate().search(['name', 'email', 'contactNumber', 'address']);
    const result = await userQuery.modelQuery;
    const meta = await userQuery.countTotal();
    return { meta, result }
}

const getSingleUserFromDB = async (id: string) => {
    const result = await User.findById(id);
    return result
}

const getMeFromDB = async (query: {
    email: string;
    role: TUserRole
}) => {
    const result = await User.findOne(query);
    return result
}

const updateSingleUserFromDB = async (id: string, data: Partial<Pick<IUser, 'name' | 'address' | 'contactNumber' | 'profile'>>) => {
    const result = await User.findByIdAndUpdate(id, data, { new: true });
    return result
}

const updateMyDataIntoDB = async (query: {
    email: string;
    role: TUserRole
}, data: Partial<Pick<IUser, 'name' | 'address' | 'contactNumber' | 'profile'>>) => {
    const result = await User.findOneAndUpdate(query, data, { new: true });
    return result
}

const toggleUserStatus = async (id: string) => {
    const query = [{ $set: { isBlock: { $not: "$isBlock" } } }]
    const result = await User.findByIdAndUpdate(id, query)
    return result
}


export const UserServices = {
    createUserIntoDB,
    getAllUserFromDB,
    getSingleUserFromDB,
    getMeFromDB,
    updateMyDataIntoDB,
    updateSingleUserFromDB,
    toggleUserStatus
}