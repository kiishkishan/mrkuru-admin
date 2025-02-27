import { Router } from "express";
import {
  getAllPurchases,
  getPurchaseStatus,
  getSuppliers,
  createPurchaseStatus,
  createSuppliers,
  deleteSupplier,
  deletePurchaseStatus,
} from "../controllers/purchaseController";

const router = Router();

router.get("/suppliers", getSuppliers);
router.post("/suppliers", createSuppliers);
router.delete("/suppliers", deleteSupplier);
router.get("/purchaseStatus", getPurchaseStatus);
router.post("/purchaseStatus", createPurchaseStatus);
router.delete("/purchaseStatus", deletePurchaseStatus);
router.get("/", getAllPurchases);

export default router;
