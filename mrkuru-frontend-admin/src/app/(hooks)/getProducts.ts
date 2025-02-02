import { useGetProductsQuery } from "@/state/api";

const useGetProducts = (searchTerm?: string) => {
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery(searchTerm);

  return {
    products,
    isLoading,
    isError,
    refetchProducts: refetch, // Expose the refetch function
  };
};

export default useGetProducts;
