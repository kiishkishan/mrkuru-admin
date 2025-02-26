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
exports.getAllPurchases = exports.createPurchaseStatus = exports.getPurchaseStatus = exports.createSuppliers = exports.getSuppliers = void 0;
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
const createSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { supplierId, supplierName, supplierContact, supplierAddress } = req.body;
        console.log("createSuppliers", req.body);
        if (!supplierId || !supplierName || !supplierContact || !supplierAddress) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        const newSupplier = yield prisma.suppliers.create({
            data: {
                supplierId,
                supplierName,
                supplierContact,
                supplierAddress,
            },
        });
        res.status(201).json(newSupplier);
    }
    catch (error) {
        console.error("Error creating supplier:", error);
        res.status(500).json({ message: "Error creating supplier" });
    }
});
exports.createSuppliers = createSuppliers;
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
const createPurchaseStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { purchaseStatusId, status } = req.body;
        if (!purchaseStatusId || !status) {
            res.status(400).json({ error: "Missing required field: status" });
            return;
        }
        const newPurchaseStatus = yield prisma.purchaseStatus.create({
            data: {
                purchaseStatusId,
                status,
            },
        });
        res.status(201).json(newPurchaseStatus);
    }
    catch (error) {
        console.error("Error creating purchase status:", error);
        res.status(500).json({ message: "Error creating purchase status" });
    }
});
exports.createPurchaseStatus = createPurchaseStatus;
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
