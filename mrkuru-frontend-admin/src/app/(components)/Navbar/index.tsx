"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useLogoutMutation } from "@/state/api";
import { logoutUser } from "@/state/slices/authSlice";
import { showToast } from "@/state/thunks/alertThunk";
import { Bell, LogOut, Menu, Moon, Sun } from "lucide-react";
import Image from "next/image";
import React, { memo } from "react";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state?.global.isSidebarCollapsed
  );

  const isDarkMode = useAppSelector((state) => state?.global.isDarkMode);
  const { userName, userImage } = useAppSelector((state) => state.auth);

  const [logOut] = useLogoutMutation();

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  const toggleLogout = async () => {
    try {
      const response = await logOut().unwrap();
      console.log("response logout", response);
      dispatch(logoutUser());
      dispatch(showToast("Logged out successfully", "success"));
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(showToast("Logout failed", "error"));
    }
  };

  return (
    <div className="flex justify-between items-center w-full mb-7">
      {/* Left Side */}
      <div className="flex justify-between items-center gap-5">
        <button
          className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="relative">
          <span className="font-bold text-xs md:text-lg lg:text-xl">
            Mr.Kuru Inventory & CMS
          </span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex justify-between items-center gap-5">
        <div className="flex justify-between items-center gap-2.5 md:gap-5">
          <div>
            <button onClick={toggleDarkMode}>
              {isDarkMode ? (
                <Sun
                  className="cursor-pointer text-gray-500 transition-all duration-500 ease-linear"
                  size={24}
                />
              ) : (
                <Moon
                  className="cursor-pointer text-gray-500 transition-all duration-500 ease-linear"
                  size={24}
                />
              )}
            </button>
          </div>
          <div className="relative hidden md:flex">
            <Bell className="cursor-pointer text-gray-500" size={24} />
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100 bg-red-400 rounded-full">
              3
            </span>
          </div>
          <hr className="w-0 h-7 border border-solid border-l border-gray-300 mx-0 md:mx-3" />
          <div className="flex items-center gap-3 cursor-pointer">
            {userImage ? (
              <Image
                src={userImage}
                alt="Profile"
                width={25}
                height={25}
                className="rounded-full object-contain w-auto h-auto"
                priority
              />
            ) : (
              <Image
                src="https://s3-mrkuru-inventorycmspos.s3.us-east-1.amazonaws.com/dummy_profile.webp"
                alt="Profile"
                width={25}
                height={25}
                className="rounded-full object-contain w-auto h-auto"
                priority
              />
            )}
            {userName ? (
              <span className="font-semibold hidden md:flex">{userName}</span>
            ) : (
              <span className="font-semibold hidden md:flex">User</span>
            )}
          </div>
          <LogOut
            className="cursor-pointer text-gray-500 hover:text-blue-500 transition-all duration-300 ease-linear"
            size={24}
            onClick={toggleLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Navbar);
