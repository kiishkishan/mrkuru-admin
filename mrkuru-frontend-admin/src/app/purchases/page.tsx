"use client";

import React, { useState } from "react";
import Header from "@/app/(components)/Header";
import PurchasesDataGrid from "@/app/purchases/purchasesDataGrid";
import SuppliersDataGrid from "@/app/purchases/(suppliers)/supplierDataGrid";
import PurchaseStatusDataGrid from "@/app/purchases/(purchaseStatus)/purchaseStatusDataGrid";

const Purchases = () => {
  const [activeTab, setActiveTab] = useState("supplier");

  const tabs = [
    { id: "supplier", label: "Supplier" },
    { id: "purchaseStatus", label: "Purchase Status" },
  ];

  return (
    <div className="flex flex-col">
      <Header name="Purchases" />

      <PurchasesDataGrid />
      {/* Tab Navigation */}
      <div className="flex w-fit items-center border bg-gray-100 justify-start gap-4 py-2 px-2 mt-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-6 text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? " bg-gray-50 text-gray-900 shadow-md"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab == "supplier" && <SuppliersDataGrid />}
      {activeTab === "purchaseStatus" && <PurchaseStatusDataGrid />}
    </div>
  );
};

export default Purchases;
