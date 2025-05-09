"use client";

import React, { useState } from "react";
import StatusFilter from "@/app/(components)/StatusFilter";
import Header from "@/app/(components)/Header";
import useGetProducts from "@/app/(hooks)/getProducts";
import SearchBar from "@/app/(components)/SearchBar";
import ProductCardSkeleton from "@/app/(components)/Skeleton/productCardSkeleton";
import ProductCard from "@/app/(components)/ProductCard";
import { useAppSelector } from "@/app/redux";
import { Replace } from "lucide-react";
import PurchaseDetailsSection from "./purchaseDetailsSection";

const CreatePurchases = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());

  const isSidebarCollapsed = useAppSelector(
    (state) => state?.global.isSidebarCollapsed
  );

  const { products, isLoading, isError } = useGetProducts(searchTerm);

  const statusFilterItems = [
    "All",
    "Cables",
    "Headphones",
    "SmartWatches",
    "Powerbanks",
  ];

  const handleProductSelect = (productId: string, selected: boolean) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(productId);
      } else {
        newSet.delete(productId);
      }
      return newSet;
    });
  };

  const handleClose = (productId?: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (productId) {
        // Remove specific product
        newSet.delete(productId);
      } else {
        // Clear all selections
        newSet.clear();
      }
      return newSet;
    });
  };

  // Filter Products based on stock quantity
  const filteredProducts = products?.filter((product) => {
    return product.stockQuantity > 0;
  });

  // Get selected products data
  const selectedProductsData = filteredProducts?.filter(product => 
    selectedProducts.has(product.productId)
  ) || [];

  if (isError && !isLoading) {
    return (
      <div className="py-4 text-red-500 text-center text-lg font-bold">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white text-white flex flex-col">
      {/* Title */}
      <Header name="Create Purchase" className="w-full text-center pt-6" />

      {/* Filters */}
      <div className="flex justify-start px-4 py-2 gap-4 bg-white shadow-md">
        <StatusFilter
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusFilterItems={statusFilterItems}
        />
        <Replace className="w-fit h-fit text-gray-600 border bg-gray-100 hover:bg-gray-200 px-4 py-3 mt-5 shadow-sm" />
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 shadow-sm">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-grow bg-gray-100 overflow-hidden">
        {/* PRODUCT LIST */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            isSidebarCollapsed
              ? "lg:grid-cols-2 xl:grid-cols-4"
              : "lg:grid-cols-2 xl:grid-cols-3"
          } 2xl:grid-cols-6 gap-6 justify-center h-svh overflow-y-auto p-8 flex-grow`}
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            : filteredProducts?.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  miniCard
                  isSelected={selectedProducts.has(product.productId)}
                  onSelect={handleProductSelect}
                />
              ))}

          {!isLoading && products?.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-center text-gray-500">
              No products found {searchTerm && `for "${searchTerm}"`}
            </div>
          )}
        </div>

        {/* Purchase ID Section */}
        <PurchaseDetailsSection 
          selectedProducts={selectedProductsData} 
          onClose={handleClose}
        />
      </div>
    </div>
  );
};

export default CreatePurchases;
