"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Rating from "@/app/(components)/Rating";
import { Check } from "lucide-react";

// Types
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
  onSelect?: (productId: string, selected: boolean) => void;
  isSelected?: boolean;
  disabled?: boolean;
}

// Constants
const FALLBACK_IMAGE = "https://s3-mrkuru-inventorycmspos.s3.us-east-1.amazonaws.com/no_product_img_found.webp";

// Components
const ProductImage = ({ 
  imageUrl, 
  name, 
  miniCard, 
  onImageLoad 
}: { 
  imageUrl: string; 
  name: string; 
  miniCard?: boolean;
  onImageLoad: () => void;
}) => (
  <div
    className={`relative ${
      miniCard ? "w-24 h-24" : "w-36 h-36"
    } bg-gray-100 overflow-hidden aspect-square ${miniCard ? 'rounded-md' : 'rounded-xl'}`}
  >
    <Image
      src={imageUrl || FALLBACK_IMAGE}
      alt={name}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover w-auto h-auto transition-opacity duration-300"
      quality={miniCard ? 60 : 80}
      priority
      onLoad={onImageLoad}
      onError={(e) => {
        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
      }}
    />
  </div>
);

const StockIndicator = ({ quantity }: { quantity: number }) => (
  <div
    className={`px-3 py-1 ${
      quantity > 0
        ? "bg-gray-100 text-gray-700"
        : "bg-red-100 text-red-700"
    } rounded-full text-sm font-medium mb-3`}
  >
    {quantity} in stock
  </div>
);

const SelectionCheckbox = ({ 
  isSelected, 
  disabled, 
  onClick 
}: { 
  isSelected: boolean; 
  disabled: boolean; 
  onClick: (e: React.MouseEvent) => void;
}) => (
  <div 
    className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-colors duration-200
      ${isSelected 
        ? 'bg-emerald-600 border-emerald-600' 
        : 'border-emerald-600'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    onClick={onClick}
  >
    {isSelected && (
      <Check className="w-3 h-3 text-white" />
    )}
  </div>
);

const ProductCard = ({ 
  product, 
  miniCard, 
  onSelect, 
  isSelected = false,
  disabled = false 
}: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [localSelected, setLocalSelected] = useState(isSelected);

  useEffect(() => {
    setLocalSelected(isSelected);
  }, [isSelected]);

  const handleSelection = (e: React.MouseEvent, source: 'card' | 'checkbox') => {
    if (disabled) return;
    
    if (source === 'checkbox') {
      e.stopPropagation();
    }

    const newSelectedState = !localSelected;
    setLocalSelected(newSelectedState);
    
    console.log(`${source === 'card' ? 'Card' : 'Checkbox'} clicked!`);
    console.log('Selected Product:', {
      id: product.productId,
      name: product.name,
      price: product.price,
      stockQuantity: product.stockQuantity,
      selected: newSelectedState
    });
    
    onSelect?.(product.productId, newSelectedState);
  };

  return (
    <div
      className={`relative border ${
        localSelected && miniCard ? 'border-emerald-500' : 'border-gray-100'
      } ${
        miniCard
          ? "shadow-md hover:shadow-lg rounded-md p-4 h-fit"
          : "shadow-lg hover:shadow-xl rounded-xl p-6"
      } max-w-full w-full mx-auto 
      bg-gradient-to-b from-white to-gray-50 transition-all duration-300 hover:-translate-y-1.5
      ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} select-none`}
      onClick={(e) => handleSelection(e, 'card')}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
    >
      <div className="flex flex-col items-center relative group">
        {/* Selection indicator overlay - only for miniCard */}
        {miniCard && (
          <div className={`absolute inset-0 bg-emerald-500/10 rounded-md transition-opacity duration-300 ${
            localSelected ? 'opacity-100' : 'opacity-0'
          }`} />
        )}

        <div className={`relative ${miniCard ? 'rounded-md overflow-hidden mt-3' : 'rounded-xl mb-4'}`}>
          <ProductImage 
            imageUrl={product.imageUrl} 
            name={product.name} 
            miniCard={miniCard}
            onImageLoad={() => setImageLoaded(true)}
          />
        </div>

        <h3
          className={`text-xl text-gray-900 font-bold mb-1 text-center ${
            miniCard ? "break-words h-24 mt-3 px-1" : ""
          }`}
        >
          {miniCard && product.name.length > 50
            ? `${product.name.substring(0, 50)}...`
            : product.name}
        </h3>

        <p className="text-2xl font-semibold text-emerald-600 mb-2">
          {product.price.toFixed(2)} LKR
        </p>

        <StockIndicator quantity={product.stockQuantity} />

        {product.rating && !miniCard && (
          <div className="flex items-center mb-4">
            <Rating rating={product.rating} />
            <span className="ml-2 text-sm text-gray-600">
              ({product.rating})
            </span>
          </div>
        )}

        {product.details && !miniCard && (
          <div className="w-full">
            <div className="text-sm text-gray-600 line-clamp-3 transition-all">
              {product.details.length > 100
                ? `${product.details.substring(0, 100)}...`
                : product.details}
            </div>
          </div>
        )}

        {miniCard && (
          <div className={`absolute inset-0 bg-white/50 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute top-2 left-2 flex items-center gap-2">
              <SelectionCheckbox 
                isSelected={localSelected}
                disabled={disabled}
                onClick={(e) => handleSelection(e, 'checkbox')}
              />
              <span className={`text-sm font-medium ${disabled ? 'text-gray-500' : 'text-gray-900'}`}>
                {localSelected ? 'Selected' : 'Select'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
