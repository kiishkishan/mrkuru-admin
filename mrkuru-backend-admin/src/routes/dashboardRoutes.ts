import { Router } from "express";
import { getDashboardMetrics } from "../controllers/dashboardController";
import { isAuthVerifyToken } from "../middleware/isAuth";

const router = Router();

router.use(isAuthVerifyToken);

router.get("/metrics", getDashboardMetrics); // http://localhost:3000/dashboard/metrics

export default router;
