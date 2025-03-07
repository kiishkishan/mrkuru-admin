import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userName: string | null;
  userImage: string | null;
}

const initialState: AuthState = {
  isAuthenticated:
    typeof window !== "undefined" && !!window.sessionStorage.getItem("token"), // Load authentication state
  token:
    typeof window !== "undefined"
      ? window.sessionStorage.getItem("token")
      : null, // Load token from session storage
  userName: null,
  userImage: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        isAuthenticated: boolean;
        token: string | null;
        userName?: string | null;
        userImage?: string | null;
      }>
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.token = action.payload.token;
      state.userName = action.payload.userName || null;
      state.userImage = action.payload.userImage || null;

      if (action.payload.token) {
        window.sessionStorage.setItem("token", action.payload.token);
      } else {
        window.sessionStorage.removeItem("token");
      }
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userName = null;
      state.userImage = null;
      window.sessionStorage.removeItem("token");
    },
  },
});

export const { setAuth, logoutUser } = authSlice.actions;
export default authSlice.reducer;
