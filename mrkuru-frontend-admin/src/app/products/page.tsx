"use client";

// import { useCreateProductMutation } from "@/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import CreateProductForm from "@/app/products/createProductForm";
import ProductCard from "@/app/products/productCard";
import useGetProducts from "@/app/(hooks)/getProducts";

// type ProductFormData = {
//   productId: string;
//   name: string;
//   price: number;
//   stockQuantity: number;
//   details?: string;
//   imageUrl: string;
// };

const Products = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreateAreaOpen, setIsCreateAreaOpen] = useState<boolean>(false);

  const { products, isLoading, isError } = useGetProducts(searchTerm);

  // const [createProduct] = useCreateProductMutation();
  // const handleCreateProduct = async (productData: ProductFormData) => {
  //   await createProduct(productData);
  // };

  const handleCreateProductArea = () => {
    if (isCreateAreaOpen === false) {
      setIsCreateAreaOpen(true);
    } else {
      setIsCreateAreaOpen(false);
    }
  };

  if (isLoading) {
    return <div className="py-4 animate-pulse">Loading...</div>;
  }

  if (isError || !products) {
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
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 m-2 text-gray-500" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6 ">
        <Header name="Products" />
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={handleCreateProductArea}
        >
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" />
          Create Product
        </button>
      </div>

      {/* CREATE PRODUCT AREA */}
      {isCreateAreaOpen && (
        <CreateProductForm onCreate={() => setIsCreateAreaOpen(false)} />
      )}

      {/* PRODUCT LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
