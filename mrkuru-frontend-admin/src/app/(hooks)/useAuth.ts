/* eslint-disable @typescript-eslint/no-explicit-any */
// useAuth.ts
import { useCallback, useLayoutEffect, useRef } from "react";
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
    (state) => state?.auth
  );
  const currentAuthState = useAppSelector((state) => state?.auth);

  const [refreshTokenMutation] = useRefreshTokenMutation();
  const [logOutMutation] = useLogoutMutation();

  const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  // Check for persisted session on initial load
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const persistedToken = window.sessionStorage.getItem("accessToken");
      const persistedUserData = window.sessionStorage.getItem("userData");
      
      if (persistedToken && !isAuthenticated) {
        try {
          const decodedToken: JWTPayload = jwtDecode(persistedToken);
          const userData = persistedUserData ? JSON.parse(persistedUserData) : {};
          
          dispatch(
            setAuth({
              isAuthenticated: true,
              accessToken: persistedToken,
              expirationTime: decodedToken.exp,
              userName: userData.userName || null,
              userImage: userData.userImage || null,
            })
          );
        } catch (error) {
          console.error("Error restoring persisted session:", error);
          window.sessionStorage.removeItem("accessToken");
          window.sessionStorage.removeItem("userData");
        }
      }
    }
  }, [dispatch, isAuthenticated]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(async () => {
      console.log("User inactive for too long, logging out...");
      // Clear session storage before logout
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("accessToken");
        window.sessionStorage.removeItem("userData");
      }
      await logOutMutation().unwrap();
      dispatch(logoutUser());
      router.push("/login");
    }, INACTIVITY_LIMIT);
  }, [INACTIVITY_LIMIT, logOutMutation, dispatch, router]);

  useLayoutEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Only redirect if we're sure there's no valid session
    if (!isAuthenticated && !accessToken && !expirationTime) {
      const persistedToken = window.sessionStorage.getItem("accessToken");
      if (!persistedToken) {
        console.log("No valid session found, redirecting to login");
        router.push("/login");
        return;
      }
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

            dispatch(
              setAuth({
                isAuthenticated: true,
                accessToken: response.accessToken,
                expirationTime: newExpirationTime,
                userName: currentAuthState?.userName || null,
                userImage: currentAuthState?.userImage || null,
              })
            );
          } else {
            throw new Error("Invalid refresh response");
          }
        } catch (error: any) {
          console.error("Error refreshing token:", error);
          // Clear session storage on refresh error
          if (typeof window !== "undefined") {
            window.sessionStorage.removeItem("accessToken");
            window.sessionStorage.removeItem("userData");
          }
          await logOutMutation().unwrap();
          dispatch(logoutUser());
          router.push("/login");
        }
      }
    };

    // Start inactivity detection
    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer)
    );

    resetInactivityTimer(); // Start timer

    // Set an interval to check expiration every 10 seconds
    timerRef.current = setInterval(checkTokenExpiry, 10000);

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
    resetInactivityTimer,
    currentAuthState,
  ]);

  return { isAuthenticated, accessToken };
};

export default useAuth;
