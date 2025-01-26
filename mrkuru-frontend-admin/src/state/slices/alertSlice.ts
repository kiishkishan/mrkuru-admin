import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AlertState {
  message: string;
  type: "success" | "error" | "loading" | "info";
}

const initialState: AlertState = {
  message: "",
  type: "success",
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<AlertState>) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearAlert: (state) => {
      state.message = "";
      state.type = "success";
    },
  },
});

export const { showAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;
