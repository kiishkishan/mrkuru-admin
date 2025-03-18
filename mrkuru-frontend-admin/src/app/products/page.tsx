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
  const [isSelected, setIsSelected] = useState(false);
  const fallbackImage =
    "https://s3-mrkuru-inventorycmspos.s3.us-east-1.amazonaws.com/no_product_img_found.webp";

  const toggleSelection = () => {
    setIsSelected((prev) => !prev);
  };

  return (
    <div
      className={`relative border border-gray-100 cursor-pointer transition-all duration-300 ease-out will-change-transform
        ${
          miniCard
            ? "shadow-md hover:shadow-lg rounded-md p-4"
            : "shadow-lg hover:shadow-xl rounded-xl p-6"
        } 
        bg-white hover:bg-gray-50 hover:scale-[1.02] hover:border-emerald-500 
        ${isSelected ? "border-emerald-500 shadow-lg" : ""}`}
      onClick={toggleSelection}
    >
      {/* MiniCard Selection Overlay */}
      {miniCard && isSelected && (
        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-md"></div>
      )}

      <div className="flex flex-col items-center relative">
        <div
          className={`relative mb-4 rounded-xl overflow-hidden aspect-square bg-gray-100
            ${miniCard ? "w-24 h-24" : "w-36 h-36"}`}
        >
          <Image
            src={product?.imageUrl || fallbackImage}
            alt={product?.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`rounded-xl object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            quality={miniCard ? 60 : 80}
            priority
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
        </div>

        <h3
          className={`text-xl text-gray-900 font-bold mb-1 text-center ${
            miniCard ? "break-words h-24 mt-2" : ""
          }`}
        >
          {miniCard && product?.name.length > 50
            ? `${product.name.substring(0, 50)}...`
            : product.name}
        </h3>

        <p className="text-2xl font-semibold text-emerald-600 mb-2">
          {product?.price.toFixed(2)} LKR
        </p>

        <div
          className={`px-3 py-1 rounded-full text-sm font-medium mb-3 ${
            product?.stockQuantity > 0
              ? "bg-gray-100 text-gray-700"
              : "bg-red-100 text-red-700"
          }`}
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

        {miniCard && (
          <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
            <input
              type="checkbox"
              checked={isSelected}
              readOnly
              className="appearance-none w-5 h-5 border-2 border-emerald-600 rounded-md checked:bg-emerald-600 checked:border-transparent focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-900">
              {isSelected ? "Selected" : "Select"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
