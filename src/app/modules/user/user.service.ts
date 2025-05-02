import httpStatus from 'http-status';
import { user_role } from './user.const';
import QueryBuilder from "../../builder/QueryBuilder";
import { IUser, TUserRole } from "./user.interface"
import { User } from "./user.model"
import AppError from '../../errors/AppError';

const createUserIntoDB = async (data: IUser) => {
    data.isBlock = false;
    data.passwordChangedAt = new Date();
    const result = await User.create(data);
    return result
}

const getAllUserFromDB = async (query: Record<string, unknown>) => {
    const userQuery = new QueryBuilder(User.find({
        isSuperAdmin: {
            $ne: true
        }
    }), query).fields().filter().paginate().search(['name', 'email', 'contactNumber', 'address']);
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

const toggleUserStatus = async (id: string, queryData: { email: string; role: TUserRole }) => {

    const userData = await User.findById(id).select('isSuperAdmin role -_id').lean();

    // block super admin status changing
    if (userData?.isSuperAdmin) {
        throw new AppError(httpStatus.FORBIDDEN, 'Cannot block or unblock super admin')
    }

    const myData = await User.findOne(queryData).select('isSuperAdmin -_id').lean();

    if (myData?.isSuperAdmin) {
        const query = [{ $set: { isBlock: { $not: "$isBlock" } } }]
        const result = await User.findByIdAndUpdate(id, query)
        return result
    } else {
        // admin cant block another admin 
        if (userData?.role === 'admin') {
            throw new AppError(httpStatus.FORBIDDEN, 'Admins cannot block other admins')
        } else {
            const query = [{ $set: { isBlock: { $not: "$isBlock" } } }]
            const result = await User.findByIdAndUpdate(id, query)
            return result
        }
    }

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