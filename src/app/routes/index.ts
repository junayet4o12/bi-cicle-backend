import { Router } from "express";
import { ProductRoutes } from "../modules/product/product.route";
import { UserRoutes } from "../modules/user/user.route";


const router = Router();

const moduleRoutes = [
    { path: '/products', route: ProductRoutes },
    { path: '/users', route: UserRoutes },
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})
export default router;