import { useGetDashboardMetricsQuery } from "@/state/api";
import { ShoppingBag } from "lucide-react";
import React from "react";
import Rating from "@/app/(components)/Rating";
import Image from "next/image";

const CardPopularProducts = () => {
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();
  console.log(dashboardMetrics?.popularProducts);

  return (
    <div
      className={`row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16 ${isLoading ? "animate-pulse" : ""
        } `}
    >
      {isLoading ? (
        <div className="m-5 animate-pulse">Loading ...</div>
      ) : (
        <>
          <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
            Popular Products
          </h3>
          <hr />
          <div className="overflow-auto h-full">
            {dashboardMetrics?.popularProducts.map((product) => (
              <div
                key={product.productId}
                className="flex items-center justify-between gap-3 px-5 py-7 border-b"
              >
                {/* LEFT SIDE */}
                <div className="flex items-center gap-3">
                  <div className="relative mb-4 rounded-xl w-36 h-36 bg-gray-100 overflow-hidden aspect-square">
                    <Image
                      src={product?.imageUrl}
                      alt={product?.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={`rounded-xl object-cover w-auto h-auto  transition-opacity duration-300`}
                      quality={50}
                      priority

                    />
                  </div>
                  <div className="flex flex-col justify-between gap-1">
                    <div className="font-bold text-gray-700">
                      {product.name}
                    </div>
                    <div className="flex text-sm items-center">
                      <span className="font-bold text-blue-500 text-xs">
                        {product.price}
                      </span>
                      <span className="mx-2">|</span>
                      <Rating rating={product.rating || 0} />
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="text-sl flex items-center">
                  <button className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  {product.stockQuantity} Sold
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CardPopularProducts;
