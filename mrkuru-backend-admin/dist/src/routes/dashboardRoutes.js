"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const router = (0, express_1.Router)();
router.get('/metrics', dashboardController_1.getDashboardMetrics); // http://localhost:3000/dashboard/metrics
exports.default = router;
