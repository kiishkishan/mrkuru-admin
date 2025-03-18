"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux";
import { logoutUser, setAuth } from "@/state/slices/authSlice";
import useRouterReady from "./useRouterReady";
import { useLogoutMutation, useRefreshTokenMutation } from "@/state/api";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const dispatch = useAppDispatch();
  const { router } = useRouterReady();
  const { accessToken, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const [refreshToken] = useRefreshTokenMutation();
  const [logOut] = useLogoutMutation();

  useEffect(() => {
    const checkTokenAndRefresh = async () => {
      if (!accessToken) {
        router.push("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken);
        const isExpired = decodedToken.exp
          ? decodedToken.exp * 1000 < Date.now()
          : true;

        if (isExpired) {
          const response = await refreshToken().unwrap();
          console.log("refreshToken response", response);
          dispatch(
            setAuth({
              isAuthenticated: true,
              accessToken: response.accessToken,
            })
          );
        }
      } catch (error) {
        const errorResponse = await logOut().unwrap();
        console.error("logOut errorResponse", { error, errorResponse });
        dispatch(logoutUser());
        router.push("/login");
      }
    };
    checkTokenAndRefresh();
  }, [accessToken, dispatch, router, refreshToken, logOut]);

  return { isAuthenticated, accessToken };
};

export default useAuth;
