import { Router } from "express";
import auth from "../../middlewares/auth";
import { AnalyticsControllers } from "./analytics.controller";
const router = Router();
router.get('/revenue', auth('admin'), AnalyticsControllers.calculateTotalRevenue);

export const AnalyticsRoutes = router 