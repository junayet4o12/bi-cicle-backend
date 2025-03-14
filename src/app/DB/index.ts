import config from "../config"
import { user_role } from "../modules/user/user.const"
import { IUser } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"

const admin: IUser = {
    name: 'Junayet',
    email: 'muhammadjunayetmaruf@gmail.com',
    contactNumber: '01632884012',
    password: config.super_admin_default_password as string,
    role: user_role.admin,
    isBlock: false,
}

const seedAdmin = async () => {
    const isAdminExist = await User.findOne({ role: user_role.admin });
    if (!isAdminExist) {
        await User.create(admin)
    }
}

export default seedAdmin