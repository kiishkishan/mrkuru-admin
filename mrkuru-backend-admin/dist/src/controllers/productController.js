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
exports.deleteProduct = exports.holdSellingProduct = exports.createProduct = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient(); // Prisma Client instance
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const products = yield prisma.products.findMany({
            where: {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            orderBy: {
                name: "asc",
            },
            select: {
                productId: true,
                name: true,
                price: true,
                rating: true,
                stockQuantity: true,
                details: true,
                imageUrl: true,
                ProductStatus: {
                    select: {
                        productStatusId: true,
                        status: true,
                    },
                },
            },
        });
        res.json(products);
    }
    catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ message: "Error retrieving products" });
    }
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, name, price, rating, stockQuantity, details, imageUrl } = req.body;
    try {
        const product = yield prisma.products.create({
            data: {
                productId,
                name,
                price,
                rating,
                stockQuantity,
                details,
                imageUrl,
                ProductStatus: {
                    connect: { productStatusId: "0d9921b7-df37-4d8d-89a0-31a00259ca8b" }, // Always set to 'In Stock' by default
                },
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error("Error creating product:", error); // Logs the complete error to the console
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case "P2002": // Unique constraint violation to find the exact issue
                    res.status(400).json({
                        message: "A product with the same unique identifier already exists.",
                    });
                    break;
                default:
                    res.status(400).json({
                        message: `Prisma error: ${error.message}`,
                    });
            }
        }
        else {
            res.status(500).json({
                message: "An unexpected error occurred.",
                error: error.message,
            });
        }
    }
});
exports.createProduct = createProduct;
const holdSellingProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
        // Validate the request
        if (!productId) {
            res.status(400).json({ message: "Product ID is required." });
            return;
        }
        // Fetch the current product's status and stock quantity
        const currentProduct = yield prisma.products.findUnique({
            where: { productId },
            select: {
                stockQuantity: true,
                ProductStatus: {
                    select: {
                        productStatusId: true,
                        status: true,
                    },
                },
            },
        });
        if (!currentProduct) {
            res.status(404).json({ message: "Product not found." });
            return;
        }
        const { stockQuantity, ProductStatus } = currentProduct;
        // Determine the target status and productStatusId based on current status and stock quantity
        let targetStatus = "";
        let targetStatusId = "";
        if (ProductStatus.status === "On Hold") {
            if (stockQuantity === 0) {
                targetStatus = "Out of Stock";
                targetStatusId = "062cd848-4ab5-4ba1-a9c7-e503ffe02bd0";
            }
            else {
                targetStatus = "In Stock";
                targetStatusId = "0d9921b7-df37-4d8d-89a0-31a00259ca8b";
            }
        }
        else {
            targetStatus = "On Hold";
            targetStatusId = "34aebdf5-fe10-4f15-97ea-e7be5dac6082";
        }
        // Update the product's status
        const updatedProduct = yield prisma.products.update({
            where: { productId },
            data: {
                ProductStatus: {
                    connect: {
                        productStatusId: targetStatusId,
                        status: targetStatus,
                    },
                },
            },
        });
        res.status(200).json({
            message: `Product status updated to "${targetStatus}" successfully.`,
            product: updatedProduct,
        });
    }
    catch (error) {
        console.error("Error updating product status:", error);
        if (error.code === "P2025") {
            res.status(404).json({ message: "Product not found." });
        }
        else {
            res.status(500).json({
                message: "An unexpected error occurred.",
                error: error.message,
            });
        }
    }
});
exports.holdSellingProduct = holdSellingProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
        console.log("deleteProduct productId", productId);
        // Step 1: Validate the productId
        if (!productId) {
            res.status(400).json({ message: "Product ID is required." });
            return;
        }
        // Step 2: Check if the product exists
        const existingProduct = yield prisma.products.findUnique({
            where: { productId },
        });
        if (!existingProduct) {
            res.status(404).json({ message: "Product not found." });
            return;
        }
        // Step 3: Delete the product
        yield prisma.products.delete({
            where: { productId },
        });
        res.status(200).json({ message: "Product deleted successfully." });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
});
exports.deleteProduct = deleteProduct;
