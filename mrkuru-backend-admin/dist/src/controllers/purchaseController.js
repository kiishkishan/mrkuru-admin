"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPurchases = exports.getPurchaseStatus = exports.getSuppliers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const suppliers = yield prisma.suppliers.findMany({
            where: {
                supplierName: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            orderBy: {
                supplierName: "asc",
            },
            select: {
                supplierId: true,
                supplierName: true,
                supplierContact: true,
                supplierAddress: true,
            },
        });
        res.status(200).json(suppliers);
    }
    catch (error) {
        console.error("Error retrieving suppliers:", error);
        res.status(500).json({ message: "Error retrieving suppliers" });
    }
});
exports.getSuppliers = getSuppliers;
const getPurchaseStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const purchaseStatus = yield prisma.purchaseStatus.findMany({
            where: {
                status: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            orderBy: {
                status: "asc",
            },
            select: {
                purchaseStatusId: true,
                status: true,
            },
        });
        res.status(200).json(purchaseStatus);
    }
    catch (error) {
        console.error("Error retrieving purchaseStatuses:", error);
        res.status(500).json({ message: "Error retrieving purchaseStatuses" });
    }
});
exports.getPurchaseStatus = getPurchaseStatus;
const getAllPurchases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchases = yield prisma.purchases.findMany({
            orderBy: {
                timeStamp: "desc",
            },
            select: {
                purchaseId: true,
                timeStamp: true,
                Suppliers: {
                    select: {
                        supplierId: true,
                        supplierName: true,
                    },
                },
                PurchaseStatus: {
                    select: {
                        purchaseStatusId: true,
                        status: true,
                    },
                },
                PurchaseDetails: {
                    select: {
                        purchaseDetailsId: true,
                        unitPrice: true,
                        totalPrice: true,
                        Products: {
                            select: {
                                productId: true,
                                name: true,
                                price: true,
                                stockQuantity: true,
                            },
                        },
                    },
                },
                subTotal: true,
                amountPaid: true,
            },
        });
        res.status(200).json(purchases);
    }
    catch (error) {
        console.error("Error retrieving purchases:", error);
        res.status(500).json({ message: "Error retrieving purchases" });
    }
});
exports.getAllPurchases = getAllPurchases;
