/* eslint-disable @typescript-eslint/no-explicit-any */
// useAuth.ts
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux";
import { logoutUser, setAuth } from "@/state/slices/authSlice";
import useRouterReady from "./useRouterReady";
import { useLogoutMutation, useRefreshTokenMutation } from "@/state/api";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  exp: number;
}

const useAuth = () => {
  const dispatch = useAppDispatch();
  const { router } = useRouterReady();
  const { accessToken, isAuthenticated, expirationTime } = useAppSelector(
    (state) => state.auth
  );

  const [refreshTokenMutation] = useRefreshTokenMutation();
  const [logOutMutation] = useLogoutMutation();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!isAuthenticated || !accessToken || !expirationTime) {
      router.push("/login");
      return;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const remainingTime = expirationTime - currentTime;

    if (remainingTime <= 0) {
      dispatch(logoutUser());
      router.push("/login");
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        const response = await refreshTokenMutation().unwrap();

        if (response.accessToken) {
          const decodedToken: JWTPayload = jwtDecode(response?.accessToken);
          console.log("decodedToken jwtDecode", decodedToken);
          const expirationTime = decodedToken.exp;

          dispatch(
            setAuth({
              isAuthenticated: true,
              accessToken: response?.accessToken,
              expirationTime,
            })
          );
        } else {
          dispatch(logoutUser());
          router.push("/login");
        }
      } catch (error: any) {
        console.error("Error refreshing token:", error);
        await logOutMutation().unwrap();
        dispatch(logoutUser());
        router.push("/login");
      }
    }, remainingTime * 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    accessToken,
    isAuthenticated,
    expirationTime,
    dispatch,
    router,
    refreshTokenMutation,
    logOutMutation,
  ]);

  return { isAuthenticated, accessToken };
};

export default useAuth;
