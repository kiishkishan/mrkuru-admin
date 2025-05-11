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
import {
  SupplierSelect,
  type Supplier,
} from "@/app/(components)/Select/SupplierSelect";
import { useGetSuppliersQuery, useCreateSupplierMutation } from "@/state/api";
import CreateSupplierForm from "@/app/purchases/(suppliers)/createSupplierForm";
import { showToast } from "@/state/thunks/alertThunk";
import { useAppDispatch } from "@/app/redux";
import LargeModal from "@/app/(components)/Modal/LargeModal";

const CreatePurchases = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [supplierError, setSupplierError] = useState<string>("");
  const [supplierSearchTerm, setSupplierSearchTerm] = useState<string>("");
  const [isCreateAreaOpen, setIsCreateAreaOpen] = useState(false);

  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state?.global.isSidebarCollapsed
  );

  const { products, isLoading, isError } = useGetProducts(searchTerm);
  const {
    data: suppliersData,
    isLoading: isSuppliersLoading,
    refetch: refetchSuppliers,
  } = useGetSuppliersQuery(supplierSearchTerm);
  const [createSupplier] = useCreateSupplierMutation();

  // Transform suppliers data to match Supplier type
  const suppliers: Supplier[] =
    suppliersData?.map((supplier) => ({
      id: supplier.supplierId,
      name: supplier.supplierName,
      email: supplier.supplierContact,
      phone: supplier.supplierContact,
      address: supplier.supplierAddress,
    })) || [];

  const handleCreateNewSupplier = () => {
    setIsCreateAreaOpen(true);
  };

  const handleCreateSupplier = async (supplierData: any) => {
    try {
      await createSupplier(supplierData).unwrap();
      dispatch(showToast("Supplier created successfully!", "success"));
      setIsCreateAreaOpen(false);
      refetchSuppliers();
    } catch (error: any) {
      console.error("Failed to create supplier:", error);
      dispatch(
        showToast("Failed to create supplier. Please try again.", "error")
      );
    }
  };

  const handleSupplierSelect = (supplier: Supplier | null) => {
    setSelectedSupplier(supplier);
    setSupplierError("");
  };

  const statusFilterItems = [
    "All",
    "Cables",
    "Headphones",
    "SmartWatches",
    "Powerbanks",
  ];

  const handleProductSelect = (productId: string, selected: boolean) => {
    setSelectedProducts((prev) => {
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
    setSelectedProducts((prev) => {
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
  const selectedProductsData =
    filteredProducts?.filter((product) =>
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
      {isCreateAreaOpen && (
        <LargeModal
          isOpen={isCreateAreaOpen}
          onClose={() => setIsCreateAreaOpen(false)}
          title="Create New Supplier"
        >
          <CreateSupplierForm onCreate={handleCreateSupplier} inModal={true} />
        </LargeModal>
      )}
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
              ? "lg:grid-cols-2 xl:grid-cols-4 sidebar-collapsed-1280"
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

        {/* Purchase Details Section */}
        <div className="w-full lg:w-[280px] xl:w-[300px] flex-none h-svh overflow-y-auto bg-white text-black shadow-sm md:border-l border-gray-200 sticky top-0">
          <div className="p-4 border-b border-gray-200">
            <SupplierSelect
              suppliers={suppliers}
              selectedSupplier={selectedSupplier}
              onSelect={handleSupplierSelect}
              error={supplierError}
              onCreateNew={handleCreateNewSupplier}
              onSearch={setSupplierSearchTerm}
              isLoading={isSuppliersLoading}
            />
          </div>

          <div className="p-4">
            <PurchaseDetailsSection
              selectedProducts={selectedProductsData}
              onClose={handleClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchases;
