/* eslint-disable @typescript-eslint/no-explicit-any */
// useAuth.ts
import { useLayoutEffect, useRef } from "react";
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

  useLayoutEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!isAuthenticated || !accessToken || !expirationTime) {
      console.log("tokens false check in");
      router.push("/login");
      return;
    }

    const checkTokenExpiry = async () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const remainingTime = expirationTime - currentTime;
      console.log("checkTokenExpiry remainingTime", {
        currentTime,
        remainingTime,
      });

      if (remainingTime <= 50) {
        // Refresh token before expiry
        console.log("Attempting to refresh token before expiry");
        try {
          const refreshTokenRequest = {
            accessToken,
          };

          const response = await refreshTokenMutation(
            refreshTokenRequest
          ).unwrap();

          if (response.accessToken) {
            const decodedToken: JWTPayload = jwtDecode(response.accessToken);
            console.log("decodedToken jwtDecode", decodedToken);
            const newExpirationTime = decodedToken.exp;

            const storedUserData = window.sessionStorage.getItem("userData");
            const parsedUserData = storedUserData
              ? JSON.parse(storedUserData)
              : {};

            dispatch(
              setAuth({
                isAuthenticated: true,
                accessToken: response.accessToken,
                expirationTime: newExpirationTime,
                userName: parsedUserData.userName || null, // Restore userName
                userImage: parsedUserData.userImage || null, // Restore userImage
              })
            );
          } else {
            throw new Error("Invalid refresh response");
          }
        } catch (error: any) {
          console.error("Error refreshing token:", error);
          await logOutMutation().unwrap();
          dispatch(logoutUser());
          router.push("/login");
        }
      }
    };

    // Set an interval to check expiration every 5 seconds
    timerRef.current = setInterval(checkTokenExpiry, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
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
