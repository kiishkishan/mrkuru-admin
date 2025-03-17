import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PurchaseState {
  selectedProducts: Product[];
}

const initialState: PurchaseState = {
  selectedProducts: [],
};

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    addProductToPurchase: (state, action: PayloadAction<Product>) => {
      const existingProduct = state.selectedProducts.find(
        (product) => product.id === action.payload.id
      );

      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
      } else {
        state.selectedProducts.push(action.payload);
      }
    },
    removeProductFromPurchase: (state, action: PayloadAction<string>) => {
      state.selectedProducts = state.selectedProducts.filter(
        (product) => product.id !== action.payload
      );
    },
    clearPurchase: (state) => {
      state.selectedProducts = [];
    },
  },
});

export const {
  addProductToPurchase,
  removeProductFromPurchase,
  clearPurchase,
} = purchaseSlice.actions;

export default purchaseSlice.reducer;
