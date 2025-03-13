import { Router } from "express";
import { getDashboardMetrics } from "../controllers/dashboardController";
import { isAuth } from "../middleware/isAuth";

const router = Router();

router.use(isAuth);

router.get("/metrics", getDashboardMetrics); // http://localhost:3000/dashboard/metrics

export default router;
