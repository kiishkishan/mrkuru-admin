import { AppDispatch } from "@/app/redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  tokenExpiration?: number | null;
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
  tokenExpiration:
    typeof window !== "undefined"
      ? Number(window.sessionStorage.getItem("tokenExpiration"))
      : null,
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
        tokenExpiration?: number | null;
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
        if (action.payload.tokenExpiration) {
          window.sessionStorage.setItem(
            "tokenExpiration",
            action.payload.tokenExpiration.toString()
          );
        }
      } else {
        window.sessionStorage.removeItem("token");
      }
    },

    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.tokenExpiration = null;
      state.userName = null;
      state.userImage = null;
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("tokenExpiration");
    },

    checkTokenExpiration: (state) => {
      if (state.tokenExpiration && Date.now() > state.tokenExpiration) {
        state.isAuthenticated = false;
        state.token = null;
        state.tokenExpiration = null;
        state.userName = null;
        state.userImage = null;
        window.sessionStorage.removeItem("token");
        window.sessionStorage.removeItem("tokenExpiration");
      }
    },
  },
});

export const { setAuth, logoutUser, checkTokenExpiration } = authSlice.actions;

// Periodically check token expiration
export const startTokenExpirationCheck = () => (dispatch: AppDispatch) => {
  setInterval(() => {
    dispatch(checkTokenExpiration());
  }, 1000); // Check every second
};

export default authSlice.reducer;
