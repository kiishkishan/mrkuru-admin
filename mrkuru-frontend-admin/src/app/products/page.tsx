"use client";

// import { useCreateProductMutation } from "@/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import CreateProductForm from "@/app/products/createProductForm";
import ProductCard from "@/app/products/productCard";
import useGetProducts from "@/app/(hooks)/getProducts";
import ProductCardSkeleton from "@/app/(components)/Skeleton/productCardSkeleton";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  details: string;
  image: object; // or use File if it's a file input
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreateAreaOpen, setIsCreateAreaOpen] = useState<boolean>(false);

  const { products, isLoading, isError, refetchProducts } =
    useGetProducts(searchTerm);

  // const [createProduct] = useCreateProductMutation();
  // const handleCreateProduct = async (productData: ProductFormData) => {
  //   await createProduct(productData);
  // };

  const toggleCreateArea = () => setIsCreateAreaOpen((prev) => !prev);

  const handleCreateProduct = async (productData: ProductFormData) => {
    try {
      // Perform the product creation logic here
      // Example: Call an API to create the product
      // await createProduct(productData);

      console.log("Product created:", productData);

      // Refetch the product list to include the newly created product
      await refetchProducts();

      // Close the create product form
      setIsCreateAreaOpen(false);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  if (isError && !isLoading) {
    return (
      <div className="py-4 text-red-500 text-center">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="relative flex items-center border-2 border-gray-300 rounded-lg shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-300">
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
        <button
          className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
          onClick={toggleCreateArea}
        >
          <PlusCircleIcon className="w-5 h-6 mr-2" />
          Create Product
        </button>
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
