"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const purchaseController_1 = require("../controllers/purchaseController");
const router = (0, express_1.Router)();
router.get("/suppliers", purchaseController_1.getSuppliers);
router.post("/suppliers", purchaseController_1.createSuppliers);
router.delete("/suppliers", purchaseController_1.deleteSupplier);
router.get("/purchaseStatus", purchaseController_1.getPurchaseStatus);
router.post("/purchaseStatus", purchaseController_1.createPurchaseStatus);
router.put("/purchaseStatus", purchaseController_1.updatePurchaseStatus);
router.delete("/purchaseStatus", purchaseController_1.deletePurchaseStatus);
router.get("/", purchaseController_1.getAllPurchases);
exports.default = router;
