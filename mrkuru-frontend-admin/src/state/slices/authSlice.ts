import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated:
    typeof window !== "undefined" && !!window.sessionStorage.getItem("token"), // Load authentication state
  token:
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("token")
      : null, // Load token from session storage
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ isAuthenticated: boolean; token: string | null }>
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.token = action.payload.token;

      if (action.payload.token) {
        window.sessionStorage.setItem("token", action.payload.token);
      } else {
        window.sessionStorage.removeItem("token");
      }
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      window.sessionStorage.removeItem("token");
    },
  },
});

export const { setAuth, logoutUser } = authSlice.actions;
export default authSlice.reducer;
