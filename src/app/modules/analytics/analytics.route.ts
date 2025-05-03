import { Router } from "express";
import auth from "../../middlewares/auth";
import { AnalyticsControllers } from "./analytics.controller";

const router = Router();

// Route for analyzing orders
router.get('/analyze-orders', auth('admin'), AnalyticsControllers.analyzeOrders);

// Route for getting last month's users
router.get('/over-year-users', auth('admin'), AnalyticsControllers.getLast12MonthUsersData);

// Route for getting top 10 products
router.get('/top-ten-products', auth('admin'), AnalyticsControllers.getTopTenProducts);

export const AnalyticsRoutes = router;
