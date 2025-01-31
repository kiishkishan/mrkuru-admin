import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Product {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  details?: string;
  imageUrl: string;
}

export interface ProductStatus {
  productStatusId: string;
  status: string;
}

export interface HoldSellingProduct {
  productId: string;
}

export interface NewProduct {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
  details?: string;
  imageUrl: string;
}

export interface SaleSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummaryId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface DashboardMetrics {
  popularProducts: Product[];
  saleSummary: SaleSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Product", "ProductStatus"],
  endpoints: (build) => ({
    // Dashboard
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "dashboard/metrics",
      providesTags: ["DashboardMetrics"],
    }),
    // Products
    getProducts: build.query<Product[], string | void>({
      query: (search) => ({
        url: "products",
        params: search ? { search } : {},
      }),
      providesTags: ["Product"],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),
    holdSellingProduct: build.mutation<Product, HoldSellingProduct>({
      query: (holdSellingProduct) => ({
        url: `/products/hold-selling`,
        method: "PUT",
        body: holdSellingProduct,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: build.mutation<{ success: boolean }, string | void>({
      query: (productId) => ({
        url: `/products`,
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: ["Product"],
    }),
    // Product Status
    getProductStatus: build.query<ProductStatus[], string | void>({
      query: (search) => ({
        url: "products",
        params: search ? { search } : {},
      }),
      providesTags: ["ProductStatus"],
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useHoldSellingProductMutation,
  useDeleteProductMutation,
  useGetProductStatusQuery,
} = api;
