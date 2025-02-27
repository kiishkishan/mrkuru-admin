"use client";

import React, { useEffect, useState } from "react";
import Header from "@/app/(components)/Header";
import PurchasesDataGrid from "@/app/purchases/(purchases)/purchasesDataGrid";
import SuppliersDataGrid from "@/app/purchases/(suppliers)/supplierDataGrid";
import PurchaseStatusDataGrid from "@/app/purchases/(purchaseStatus)/purchaseStatusDataGrid";
import SubHeadingSkeleton from "../(components)/Skeleton/subHeadingSkeleton";

const Purchases = () => {
  const [activeTab, setActiveTab] = useState("supplier");
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: "supplier", label: "Supplier" },
    { id: "purchaseStatus", label: "Purchase Status" },
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="flex flex-col">
      <Header name="Purchases" />

      <PurchasesDataGrid />
      {isLoading ? (
        <SubHeadingSkeleton style="w-1/4 py-2 px-2 mt-5 h-16" />
      ) : (
        <div className="flex w-fit items-center border bg-gray-100 justify-start gap-4 py-2 px-2 mt-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-6 text-sm font-medium transition-all duration-200 ease-in-out transform ${
                activeTab === tab.id
                  ? "bg-gray-50 text-gray-900 shadow-md scale-105"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {activeTab == "supplier" && <SuppliersDataGrid />}
      {activeTab === "purchaseStatus" && <PurchaseStatusDataGrid />}
    </div>
  );
};

export default Purchases;
