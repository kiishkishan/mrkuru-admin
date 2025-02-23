import { Router } from "express";
import {
  getAllPurchases,
  getPurchaseStatus,
  getSuppliers,
  createPurchaseStatus,
  createSuppliers,
} from "../controllers/purchaseController";

const router = Router();

router.get("/suppliers", getSuppliers);
router.get("/suppliers", createSuppliers);
router.get("/purchaseStatus", getPurchaseStatus);
router.get("/purchaseStatus", createPurchaseStatus);
router.get("/", getAllPurchases);

export default router;
