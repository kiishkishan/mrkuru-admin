import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/app/redux"; // Adjust the path to your Redux store file

// login type
export interface Login {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expirationTime: string;
  user: {
    name: string;
    profileImage: string;
  };
}

export interface RefreshToken {
  accessToken: string;
}

//signup type
export interface Signup {
  userId: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage?: File;
}

// getProducts type
export interface Products {
  productId: string;
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  details: string;
  imageUrl: string;
}

// createProduct types
export interface Product {
  name: string;
  price: number;
  stockQuantity: number;
  details: string;
  image: File;
  status?: string;
  productId?: string;
}

export interface NewProduct {
  name: string;
  price: number;
  stockQuantity: number;
  details: string;
  image: File;
  status?: string;
  productId?: string;
}

export interface ImageFile {
  image: File;
}

export interface FormData {
  image: File;
}

export interface ProductStatus {
  productStatusId: string;
  status: string;
}

export interface HoldSellingProduct {
  productId: string;
}

export interface Suppliers {
  supplierId: string;
  supplierName: string;
  supplierContact: string;
  supplierAddress: string;
}

export interface NewSuppliers {
  supplierId?: string;
  supplierName: string;
  supplierContact: string;
  supplierAddress: string;
}

export interface PurchaseStatus {
  purchaseStatusId: string;
  status: string;
}

export interface NewPurchaseStatus {
  purchaseStatusId?: string;
  status: string;
}

export interface UpdatePurchaseStatus {
  purchaseId: string;
  targetStatusId: string;
}

export interface Purchases {
  purchaseId: string;
  timeStamp: string;
  subTotal: number;
  shippingFee: number;
  totalAmount: number;
  amountPaid: number;
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
  popularProducts: Products[];
  saleSummary: SaleSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

// jwt typesafety
// interface JwtPayload {
//   id: string;
//   userName: string;
//   iat: number;
//   exp: number;
// }

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: "include", // Include credentials (cookies) in requests
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState; // Adjust based on your state structure
      const token = state.auth?.accessToken;
      headers.set("Authorization", `Bearer ${token}`);
    },
  }),
  reducerPath: "api",
  tagTypes: [
    "Auth",
    "DashboardMetrics",
    "Product",
    "ProductStatus",
    "Purchases",
  ],
  endpoints: (build) => ({
    // Authentication
    loginUser: build.mutation<LoginResponse, Login>({
      query: (login: Login) => ({
        url: "auth/login",
        method: "POST",
        body: login,
      }),
      invalidatesTags: ["Auth"],
    }),
    refreshToken: build.mutation<RefreshToken, RefreshToken>({
      query: (refreshToken) => ({
        url: "/auth/refresh",
        method: "POST", // Use POST if your backend expects it
        credentials: "include",
        body: refreshToken,
      }),
    }),

    logout: build.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    signUpUser: build.mutation<Signup, Signup>({
      query: (signup: Signup) => {
        const formData = new FormData();

        Object.entries(signup).forEach(([key, value]) => {
          if (value instanceof File) {
            formData.append(key, value); // Append file as is
          } else {
            formData.append(key, String(value)); // Convert non-file values to string
          }
        });

        console.log(
          Object.fromEntries(formData.entries()),
          "formData append in query"
        );

        return {
          url: "auth/signup",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Auth"],
    }),
    // Dashboard
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "dashboard/metrics",
      providesTags: ["DashboardMetrics"],
    }),
    // Products
    getProducts: build.query<Products[], string | void>({
      query: (search) => ({
        url: "products",
        params: search ? { search } : {},
      }),
      providesTags: ["Product"],
    }),
    uploadImagetoS3: build.mutation<ImageFile, ImageFile>({
      query: (imageFile) => ({
        url: "products/uploadImagetoS3",
        method: "POST",
        body: imageFile,
      }),
      invalidatesTags: ["Product"],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct: NewProduct) => {
        const formData = new FormData();

        Object.entries(newProduct).forEach(([key, value]) => {
          if (value instanceof File) {
            formData.append(key, value); // Append file as is
          } else {
            formData.append(key, String(value)); // Convert non-file values to string
          }
        });

        console.log(
          Object.fromEntries(formData.entries()),
          "formData append in query"
        );

        return {
          url: "products",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Product"],
    }),
    holdSellingProduct: build.mutation<Product, HoldSellingProduct>({
      query: (holdSellingProduct) => ({
        url: `products/hold-selling`,
        method: "PUT",
        body: holdSellingProduct,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: build.mutation<{ success: boolean }, string | void>({
      query: (productId) => ({
        url: `products`,
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: ["Product"],
    }),
    // Product Status
    getProductStatus: build.query<ProductStatus[], string | void>({
      query: (search) => ({
        url: "productStatus",
        params: search ? { search } : {},
      }),
      providesTags: ["ProductStatus"],
    }),
    // Purchases
    getSuppliers: build.query<Suppliers[], string | void>({
      query: (search) => ({
        url: "purchases/suppliers",
        params: search ? { search } : {},
      }),
      providesTags: ["Purchases"],
    }),
    getPurchaseStatus: build.query<PurchaseStatus[], string | void>({
      query: (search) => ({
        url: "purchases/purchaseStatus",
        params: search ? { search } : {},
      }),
      providesTags: ["Purchases"],
    }),
    getPurchases: build.query<Purchases[], string | void>({
      query: (search) => ({
        url: "purchases",
        params: search ? { search } : {},
      }),
      providesTags: ["Purchases"],
    }),
    createPurchaseStatus: build.mutation<PurchaseStatus, NewPurchaseStatus>({
      query: (newPurchaseStatus: NewPurchaseStatus) => ({
        url: "purchases/purchaseStatus",
        method: "POST",
        body: newPurchaseStatus,
      }),
      invalidatesTags: ["Purchases"],
    }),
    createSupplier: build.mutation<Suppliers, NewSuppliers>({
      query: (newSuppliers: NewSuppliers) => ({
        url: "purchases/suppliers",
        method: "POST",
        body: newSuppliers,
      }),
      invalidatesTags: ["Purchases"],
    }),
    deleteSupplier: build.mutation<{ success: boolean }, string | void>({
      query: (supplierId) => ({
        url: `purchases/suppliers`,
        method: "DELETE",
        body: { supplierId },
      }),
      invalidatesTags: ["Purchases"],
    }),
    deletePurchaseStatus: build.mutation<{ success: boolean }, string | void>({
      query: (purchaseStatusId) => ({
        url: `purchases/purchaseStatus`,
        method: "DELETE",
        body: { purchaseStatusId },
      }),
      invalidatesTags: ["Purchases"],
    }),
    updatePurchaseStatus: build.mutation<PurchaseStatus, UpdatePurchaseStatus>({
      query: (updatePurchaseStatus: UpdatePurchaseStatus) => ({
        url: `purchases/purchaseStatus`,
        method: "PUT",
        body: updatePurchaseStatus,
      }),
      invalidatesTags: ["Purchases"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useSignUpUserMutation,
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useUploadImagetoS3Mutation,
  useCreateProductMutation,
  useHoldSellingProductMutation,
  useDeleteProductMutation,
  useGetProductStatusQuery,
  useGetSuppliersQuery,
  useGetPurchaseStatusQuery,
  useGetPurchasesQuery,
  useCreatePurchaseStatusMutation,
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useDeletePurchaseStatusMutation,
  useUpdatePurchaseStatusMutation,
} = api;
