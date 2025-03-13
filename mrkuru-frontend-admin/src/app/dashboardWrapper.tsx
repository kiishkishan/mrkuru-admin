"use client";

import React, { useEffect } from "react";
import Navbar from "@/app/(components)/Navbar";
import Sidebar from "@/app/(components)/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import LoginPage from "@/app/login/page";
import useRouterReady from "@/app/(hooks)/useRouterReady";
import SignupPage from "@/app/signup/page";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state?.global.isSidebarCollapsed
  );

  const isDarkMode = useAppSelector((state) => state?.global.isDarkMode);
  const isAuthenticated = useAppSelector(
    (state) => state?.auth.isAuthenticated
  );

  const { pathname } = useRouterReady();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("light");
    }
  }, [isDarkMode]);

  const layoutClasses = isDarkMode ? "dark" : "light";

  // If user is not authenticated, show login page
  if (isAuthenticated === false) {
    console.log("User is not authenticated");
    if (pathname === "/signup") {
      return (
        <div className={`${layoutClasses}`}>
          <SignupPage />
        </div>
      );
    }
    return (
      <div className={`${layoutClasses}`}>
        <LoginPage />
      </div>
    );
  }

  return (
    <div
      className={`${layoutClasses} flex bg-gray-50 text-gray-900 w-full min-h-screen`}
    >
      <Sidebar />
      <main
        className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${
          isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout> {children} </DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;
