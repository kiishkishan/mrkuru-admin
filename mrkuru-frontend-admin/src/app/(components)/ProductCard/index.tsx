"use client";

import { useState } from "react";
import Image from "next/image";
import Rating from "@/app/(components)/Rating";

type Product = {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
  rating?: number;
  details?: string;
  imageUrl: string;
};

interface ProductCardProps {
  product: Product;
  miniCard?: boolean;
}

const ProductCard = ({ product, miniCard }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const fallbackImage =
    "https://s3-mrkuru-inventorycmspos.s3.us-east-1.amazonaws.com/no_product_img_found.webp";

  return (
    <div
      className="border border-gray-100 shadow-lg hover:shadow-xl rounded-xl p-6 max-w-full w-full mx-auto 
    bg-gradient-to-b from-white to-gray-50 transition-all duration-300 hover:-translate-y-1.5"
    >
      <div className="flex flex-col items-center">
        <div
          className={`relative mb-4 rounded-xl ${
            miniCard ? "w-24 h-24" : "w-36 h-36"
          } bg-gray-100 overflow-hidden aspect-square`}
        >
          <Image
            src={product?.imageUrl || fallbackImage}
            alt={product?.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`rounded-xl object-cover w-auto h-auto ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
            quality={miniCard ? 60 : 80}
            priority
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
        </div>

        <h3 className="text-xl text-gray-900 font-bold mb-1 text-center">
          {product?.name}
        </h3>

        <p className="text-2xl font-semibold text-emerald-600 mb-2">
          {product?.price.toFixed(2)} LKR
        </p>

        <div
          className={`px-3 py-1 ${
            product?.stockQuantity > 0
              ? "bg-gray-100 text-gray-700"
              : "bg-red-100 text-red-700"
          } rounded-full text-sm font-medium mb-3`}
        >
          {product?.stockQuantity} in stock
        </div>

        {product?.rating && !miniCard && (
          <div className="flex items-center mb-4">
            <Rating rating={product?.rating} />
            <span className="ml-2 text-sm text-gray-600">
              ({product.rating})
            </span>
          </div>
        )}

        {product?.details && !miniCard && (
          <div className="w-full">
            <div className="text-sm text-gray-600 line-clamp-3 transition-all">
              {product.details.length > 100
                ? `${product.details.substring(0, 100)}...`
                : product.details}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
