"use client";

import { SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import CreateProductForm from "@/app/products/createProductForm";
import ProductCard from "@/app/products/productCard";
import useGetProducts from "@/app/(hooks)/getProducts";
import ProductCardSkeleton from "@/app/(components)/Skeleton/productCardSkeleton";
import { useCreateProductMutation } from "@/state/api";
import CreateButton from "@/app/(components)/Button/createButton";
import { showToast } from "@/state/thunks/alertThunk";
import { useAppDispatch } from "../redux";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  details: string;
  image: File;
  productId?: string;
  status?: string;
};

type Products = {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  details: string;
  imageUrl: string;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreateAreaOpen, setIsCreateAreaOpen] = useState<boolean>(false);

  const { products, isLoading, isError, refetchProducts } =
    useGetProducts(searchTerm);

  const [createProduct] = useCreateProductMutation();

  const dispatch = useAppDispatch();

  const handleCreateProduct = async (productData: ProductFormData) => {
    try {
      console.log("Product Data", productData.image);
      await createProduct(productData);
      setTimeout(() => {
        refetchProducts();
      }, 1000);
      setIsCreateAreaOpen(false);
      dispatch(showToast("Product created successfully!", "success"));
    } catch (error) {
      console.error("Failed to create product", error);
      // Show an error toast
      dispatch(
        showToast("Failed to create product. Please try again.", "error")
      );
    }
  };

  const toggleCreateArea = () => setIsCreateAreaOpen((prev) => !prev);

  if (isError && !isLoading) {
    return (
      <div className="py-4 text-red-500 text-center text-lg font-bold">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="relative flex items-center border-2 border-gray-300 rounded-lg shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-300 text-base sm:text-sm">
          <SearchIcon className="w-5 h-5 ml-4 text-gray-500 shrink-0" />
          <input
            aria-label="Search products"
            className="w-full py-3 pl-2 pr-4 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <CreateButton name="Create Product" onClickCreate={toggleCreateArea} />
      </div>

      {/* CREATE PRODUCT AREA */}
      {isCreateAreaOpen && <CreateProductForm onCreate={handleCreateProduct} />}

      {/* PRODUCT LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : products?.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
      </div>

      {!isLoading && products?.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No products found {searchTerm && `for "${searchTerm}"`}
        </div>
      )}
    </div>
  );
};

export default Products;
