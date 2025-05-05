import { Router } from "express";
import { ProductRoutes } from "../modules/product/product.route";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { OrderRoutes } from "../modules/order/order.route";
import { AnalyticsRoutes } from "../modules/analytics/analytics.route";
import { SubscribeRoutes } from "../modules/subscribe/subscribe.route";


const router = Router();

const moduleRoutes = [
    { path: '/products', route: ProductRoutes },
    { path: '/users', route: UserRoutes },
    { path: '/auth', route: AuthRoutes },
    { path: '/orders', route: OrderRoutes },
    { path: '/analytics', route: AnalyticsRoutes },
    { path: '/subscribes', route: SubscribeRoutes },
]

moduleRoutes.forEach(route => {
    router.use(route.path, route.route)
})
export default router;