"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { Bell, Menu, Moon, Sun } from "lucide-react";
import Image from "next/image";
import React from "react";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
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
        <div className="flex justify-between items-center gap-5">
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
            <Image
              src="https://s3-mrkuru-inventorycmspos.s3.us-east-1.amazonaws.com/profile.webp"
              alt="Profile"
              width={25}
              height={25}
              className="rounded-full object-contain"
              priority
            />
            <span className="font-semibold hidden md:flex">Kishanth</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
