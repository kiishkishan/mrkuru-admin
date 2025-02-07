"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  Archive,
  CircleDollarSign,
  Layout,
  LucideIcon,
  Menu,
  Package,
  ShoppingCart,
  SlidersHorizontal,
  User,
  WalletCards,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isColapsed: boolean;
}

const SidebarLink = memo(
  ({ href, icon: Icon, label, isColapsed }: SidebarLinkProps) => {
    const pathname = usePathname();
    const isActive =
      pathname === href || (pathname === "/" && href === "/dashboard"); // handle link highlighting

    return (
      <Link href={href}>
        <div
          className={`cursor-pointer flex items-center ${
            isColapsed ? "justify-center py-4" : "justify-start py-4 px-8"
          } hover:text-blue-500 hover:bg-blue-100 gap-3 transition-colors ${
            isActive ? "bg-blue-200 text-white" : "text-gray-700" // text-gray-700 is optional
          }`}
        >
          <Icon className="w-6 h-6 !text-gray-700" />
          <span
            className={`${
              isColapsed ? "hidden" : "block"
            } font-medium text-gray-700`}
          >
            {label}
          </span>
        </div>
      </Link>
    );
  }
);

SidebarLink.displayName = "SidebarLink";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-72 md:w-64"
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  return (
    <div className={sidebarClassNames}>
      {/* TOP LOGO */}
      <div
        className={`flex gap-3 justify-center md:justify-evenly items-center pt-8 ${
          isSidebarCollapsed ? "px-2" : "mx-10"
        }`}
      >
        <Image
          src="https://s3-mrkuru-inventorycmspos.s3.us-east-1.amazonaws.com/mrkuru_logo_transparent.webp"
          alt="Logo"
          width={150}
          height={150}
          className={`rounded-xl object-cover w-auto h-auto transition-opacity duration-300`}
          priority
        />
        <button
          className="md:hidden px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* LINKS MENU */}
      <div className="flex-grow mt-8">
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          label="Dashboard"
          isColapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/inventory"
          icon={Archive}
          label="Inventory"
          isColapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/products"
          icon={Package}
          label="Products"
          isColapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/sales"
          icon={ShoppingCart}
          label="Sales"
          isColapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/purchases"
          icon={WalletCards}
          label="Purchases"
          isColapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/expenses"
          icon={CircleDollarSign}
          label="Expenses"
          isColapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/users"
          icon={User}
          label="Users"
          isColapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/settings"
          icon={SlidersHorizontal}
          label="Settings"
          isColapsed={isSidebarCollapsed}
        />
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} mb-10`}>
        <p className="text-center text-xs text-gray-500">&copy; 2025 Mr.Kuru</p>
      </div>
    </div>
  );
};

export default Sidebar;
