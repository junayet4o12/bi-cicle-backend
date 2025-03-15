import { Router } from "express";
import { ProductRoutes } from "../modules/product/product.route";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";


const router = Router();

const moduleRoutes = [
    { path: '/products', route: ProductRoutes },
    { path: '/users', route: UserRoutes },
    { path: '/auth', route: AuthRoutes },
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})
export default router;