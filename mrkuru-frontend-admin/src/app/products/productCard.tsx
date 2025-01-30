"use client";

import { useState } from "react";
import Image from "next/image";
import Rating from "@/app/(components)/Rating";
import ImageSkeleton from "@/app/(components)/Skeleton/imageSkeleton";

interface Product {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
  rating?: number;
  details?: string;
  imageUrl: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const fallbackImage =
    "https://s3-mrkuru-inventorycmspos.s3.us-east-1.amazonaws.com/no_product_img_found.webp";

  return (
    <div className="border border-gray-100 shadow-lg hover:shadow-xl rounded-xl p-6 max-w-full w-full mx-auto bg-gradient-to-b from-white to-gray-50 transition-all duration-300 hover:-translate-y-1.5">
      <div className="flex flex-col items-center">
        {/* Image with loading state */}
        <div className="relative mb-4 rounded-xl w-36 h-36 bg-gray-100 overflow-hidden">
          {!imageLoaded && <ImageSkeleton />}
          <Image
            src={product?.imageUrl || fallbackImage}
            alt={product?.name}
            fill
            className={`rounded-xl object-cover ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
            loading="lazy"
            onLoadingComplete={() => setImageLoaded(true)}
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

        {product?.rating && (
          <div className="flex items-center mb-4">
            <Rating rating={product?.rating} />
            <span className="ml-2 text-sm text-gray-600">
              ({product.rating})
            </span>
          </div>
        )}

        {product?.details && (
          <div className="w-full">
            <div className="text-sm text-gray-600 line-clamp-3 transition-all">
              {product.details}
            </div>
            {product.details.length > 100 && (
              <button className="text-blue-600 text-sm font-medium mt-1 hover:text-blue-700">
                Show more
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
