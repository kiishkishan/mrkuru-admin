"use client";

// import { useCreateProductMutation } from "@/state/api";
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import CreateProductForm from "@/app/products/createProductForm";
import Image from "next/image";
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

  // const {
  //   data: products,
  //   isLoading,
  //   isError,
  // } = useGetProductsQuery(searchTerm);

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
          <div
            key={product?.productId}
            className="border border-gray-100 shadow-lg hover:shadow-xl rounded-xl p-6 max-w-full w-full mx-auto bg-gradient-to-b from-white to-gray-50 transition-all duration-300 hover:-translate-y-1.5"
          >
            <div className="flex flex-col items-center">
              {/* Improved Image Loading */}
              <div className="relative mb-4 rounded-xl w-36 h-36 bg-gray-100">
                <Image
                  src={
                    product?.imageUrl ||
                    `https://s3-mrkuru-inventorycmspos.s3.us-east-1.amazonaws.com/no_product_img_found.png`
                  }
                  alt={product?.name}
                  fill
                  className="rounded-xl object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://s3-mrkuru-inventorycmspos.s3.us-east-1.amazonaws.com/no_product_img_found.png";
                  }}
                />
              </div>

              {/* Product Information */}
              <h3 className="text-xl text-gray-900 font-bold mb-1 text-center">
                {product?.name}
              </h3>
              <p className="text-2xl font-semibold text-emerald-600 mb-2">
                {product?.price.toFixed(2)} LKR
              </p>

              {/* Stock Quantity */}

              <div
                className={`px-3 py-1 ${
                  product?.stockQuantity > 0
                    ? "bg-gray-100 text-gray-700"
                    : "bg-red-100 text-red-700"
                } rounded-full text-sm font-medium mb-3`}
              >
                {product?.stockQuantity} in stock
              </div>

              {/* Rating */}
              {product?.rating && (
                <div className="flex items-center mb-4">
                  <Rating rating={product?.rating} />
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.rating})
                  </span>
                </div>
              )}

              {/* Product Details */}
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
        ))}
      </div>
    </div>
  );
};

export default Products;
