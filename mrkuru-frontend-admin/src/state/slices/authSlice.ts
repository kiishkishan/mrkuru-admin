import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userName: string | null;
  userImage: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false, // Avoid direct access to `window`
  accessToken: null,
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
        accessToken: string | null;
        userName?: string | null;
        userImage?: string | null;
      }>
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.accessToken = action.payload.accessToken;
      state.userName = action.payload.userName || null;
      state.userImage = action.payload.userImage || null;

      if (typeof window !== "undefined") {
        if (action.payload.accessToken) {
          window.sessionStorage.setItem(
            "accessToken",
            action.payload.accessToken
          );
        } else {
          window.sessionStorage.removeItem("accessToken");
        }
      }
    },

    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.userName = null;
      state.userImage = null;

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("accessToken");
      }
    },
  },
});

export const { setAuth, logoutUser } = authSlice.actions;
export default authSlice.reducer;
