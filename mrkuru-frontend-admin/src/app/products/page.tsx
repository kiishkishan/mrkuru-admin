"use client";

import { useState } from "react";
import Header from "@/app/(components)/Header";
import CreateProductForm from "@/app/products/createProductForm";
import ProductCard from "@/app/(components)/ProductCard";
import useGetProducts from "@/app/(hooks)/getProducts";
import ProductCardSkeleton from "@/app/(components)/Skeleton/productCardSkeleton";
import { useCreateProductMutation } from "@/state/api";
import CreateButton from "@/app/(components)/Button/createButton";
import { showToast } from "@/state/thunks/alertThunk";
import { useAppDispatch } from "@/app/redux";
import SearchBar from "@/app/(components)/SearchBar";

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
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
