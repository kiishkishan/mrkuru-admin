import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const prisma = new PrismaClient(); // Prisma Client instance

// Configure the S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();

    const products = await prisma.products.findMany({
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
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("File:", req.file);
    console.log("Body:", req.body);

    const { name, price, stockQuantity, details, productId, status } = req.body;

    if (!productId || !name || !price || !stockQuantity) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    let imageUrl = "";
    if (req.file) {
      console.log('Original file size:', req.file.size, 'bytes');
      console.log('Original file type:', req.file.mimetype);

      let processedBuffer;
      if (req.file.mimetype === 'image/webp') {
        // If it's already WebP, just resize if needed
        processedBuffer = await sharp(req.file.buffer)
          .resize(800)
          .toBuffer();
      } else {
        // Convert other formats to WebP
        processedBuffer = await sharp(req.file.buffer)
          .resize(800)
          .toFormat("webp")
          .webp({ quality: 80 })
          .toBuffer();
      }

      console.log('Processed buffer size:', processedBuffer.length, 'bytes');

      // Generate unique filename
      const fileKey = `product_${productId}.webp`;

      // Upload to S3
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: fileKey,
          Body: processedBuffer,
          ContentType: "image/webp",
        })
      );

      imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    }

    // Store product in DB
    const newProduct = await prisma.products.create({
      data: {
        productId,
        name,
        price: Number(price),
        rating: Number("4.5"),
        stockQuantity: parseInt(stockQuantity),
        details,
        imageUrl,
        ProductStatus: {
          connect: { productStatusId: status }, // Always set to 'In Stock' by default
        },
      },
    });

    res.json({
      message: "Product created successfully",
      newProduct,
    });
  } catch (error) {
    console.error("Error processing product:", error);
    next(error);
  }
};

export const holdSellingProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.body;

    // Validate the request
    if (!productId) {
      res.status(400).json({ message: "Product ID is required." });
      return;
    }

    // Fetch the current product's status and stock quantity
    const currentProduct = await prisma.products.findUnique({
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
      } else {
        targetStatus = "In Stock";
        targetStatusId = "0d9921b7-df37-4d8d-89a0-31a00259ca8b";
      }
    } else {
      targetStatus = "On Hold";
      targetStatusId = "34aebdf5-fe10-4f15-97ea-e7be5dac6082";
    }

    // Update the product's status
    const updatedProduct = await prisma.products.update({
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
  } catch (error: any) {
    console.error("Error updating product status:", error);
    if (error.code === "P2025") {
      res.status(404).json({ message: "Product not found." });
    } else {
      res.status(500).json({
        message: "An unexpected error occurred.",
        error: error.message,
      });
    }
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.body;

    console.log("deleteProduct productId", productId);

    // Step 1: Validate the productId
    if (!productId) {
      res.status(400).json({ message: "Product ID is required." });
      return;
    }

    // Step 2: Check if the product exists
    const existingProduct = await prisma.products.findUnique({
      where: { productId },
    });

    if (!existingProduct) {
      res.status(404).json({ message: "Product not found." });
      return;
    }

    // Step 3: Extract S3 Image Key from URL (assuming stored in `imageUrl` field)
    const imageUrl = existingProduct.imageUrl; // Adjust according to DB schema
    if (imageUrl) {
      const bucketName = process.env.AWS_S3_BUCKET_NAME!;
      const key = imageUrl.split("/").slice(-1)[0]; // Extract filename from URL

      // Step 4: Delete Image from S3
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
          })
        );
        console.log(`Deleted S3 image: ${key}`);
      } catch (s3Error) {
        console.error("Error deleting image from S3:", s3Error);
      }
    }

    // Step 3: Delete the product
    await prisma.products.delete({
      where: { productId },
    });

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};
