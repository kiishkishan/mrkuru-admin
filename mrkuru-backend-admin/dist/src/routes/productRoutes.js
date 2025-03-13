"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const multerConfig_1 = __importDefault(require("../config/multerConfig"));
const isAuth_1 = require("../middleware/isAuth");
const router = (0, express_1.Router)();
router.use(isAuth_1.isAuth);
router.get("/", productController_1.getProducts);
router.post("/", multerConfig_1.default.single("image"), productController_1.createProduct);
router.put("/hold-selling", productController_1.holdSellingProduct);
router.delete("/", productController_1.deleteProduct);
exports.default = router;
