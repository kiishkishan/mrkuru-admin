"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productStatusController_1 = require("../controllers/productStatusController");
const router = (0, express_1.Router)();
router.get("/", productStatusController_1.getProductStatus);
exports.default = router;
