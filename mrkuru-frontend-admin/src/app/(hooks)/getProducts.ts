import { useGetProductsQuery } from "@/state/api";

const useGetProducts = () => {
  const { data: products, isLoading, isError, refetch } = useGetProductsQuery();

  return {
    products,
    isLoading,
    isError,
    refetchProducts: refetch, // Expose the refetch function
  };
};

export default useGetProducts;
