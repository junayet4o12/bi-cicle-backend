import { Router } from "express";
import auth from "../../middlewares/auth";
import { AnalyticsControllers } from "./analytics.controller";

const router = Router();

// Route for analyzing orders
router.get('/analyze-orders', auth('admin'), AnalyticsControllers.analyzeOrders);

// Route for getting last 12 months analytics (users + orders + revenue)
router.get('/over-year-analytics', auth('admin'), AnalyticsControllers.getLast12MonthsAnalyticsData);

// Route for getting top 10 products
router.get('/top-ten-products', auth('admin'), AnalyticsControllers.getTopTenProducts);

export const AnalyticsRoutes = router;
