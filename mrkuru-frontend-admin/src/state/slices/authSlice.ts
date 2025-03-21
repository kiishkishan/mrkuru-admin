/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userName: string | null;
  userImage: string | null;
  expirationTime: number | null;
}

const initialState: AuthState = {
  isAuthenticated: false, // Avoid direct access to `window`
  accessToken: null,
  userName: null,
  userImage: null,
  expirationTime: null,
};

let logoutTimer: any; // Store the timer ID

interface JWTPayload {
  exp: number;
}

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
        expirationTime?: number; // Make expirationTime optional
      }>
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.accessToken = action.payload.accessToken;
      state.userName = action.payload.userName || null;
      state.userImage = action.payload.userImage || null;

      //Get token details from jwt
      const decodedToken: JWTPayload = jwtDecode(action.payload.accessToken!);
      console.log("authSlice decodedToken", decodedToken);
      state.expirationTime = decodedToken?.exp;

      if (typeof window !== "undefined") {
        if (action.payload.accessToken) {
          window.sessionStorage.setItem(
            "accessToken",
            action.payload.accessToken
          );
          window.sessionStorage.setItem(
            "userData",
            JSON.stringify({
              userName: action.payload.userName,
              userImage: action.payload.userImage,
            })
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
      state.expirationTime = null;

      if (logoutTimer) {
        clearTimeout(logoutTimer); // Clear the timer on explicit logout
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("accessToken");
        window.sessionStorage.removeItem("userData");
      }
    },
  },
});

export const { setAuth, logoutUser } = authSlice.actions;
export default authSlice.reducer;
