"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const purchaseController_1 = require("../controllers/purchaseController");
const router = (0, express_1.Router)();
router.get("/suppliers", purchaseController_1.getSuppliers);
router.get("/purchaseStatus", purchaseController_1.getPurchaseStatus);
router.get("/", purchaseController_1.getAllPurchases);
exports.default = router;
