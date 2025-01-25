"use client";

import { CheckCircle, Package, TrendingDown, TrendingUp } from "lucide-react";
import CardExpenseSummary from "./cardExpenseSummary";
import CardPopularProducts from "./cardPopularProducts";
import CardPurchaseSummary from "./cardPurchaseSummary";
import CardSalesSummary from "./cardSalesSummary";
import StatCard from "./statCard";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows">
      <CardPopularProducts />
      <CardSalesSummary />
      <CardPurchaseSummary />
      <CardExpenseSummary />
      <StatCard
        title="Customer & Expenses"
        primaryIcon={<Package className="text-blue-500 w-6 h-6" />}
        dateRange="22 - 29 October 2025"
        details={[
          {
            title: "Customer Growth",
            amount: "120.00",
            changePercentage: 75,
            IconComponent: TrendingUp,
          },
          {
            title: "Expenses",
            amount: "12.00",
            changePercentage: -56,
            IconComponent: TrendingDown,
          },
        ]}
      />
      <StatCard
        title="Dues & Pending Orders"
        primaryIcon={<CheckCircle className="text-blue-500 w-6 h-6" />}
        dateRange="22 - 29 October 2025"
        details={[
          {
            title: "Dues",
            amount: "280.00",
            changePercentage: 60,
            IconComponent: TrendingUp,
          },
          {
            title: "Pending Orders",
            amount: "120.00",
            changePercentage: -26,
            IconComponent: TrendingDown,
          },
        ]}
      />
      <StatCard
        title="Sales & Discount"
        primaryIcon={<Package className="text-blue-500 w-6 h-6" />}
        dateRange="22 - 29 October 2025"
        details={[
          {
            title: "Sales",
            amount: "1100.00",
            changePercentage: 25,
            IconComponent: TrendingUp,
          },
          {
            title: "Discount",
            amount: "50.00",
            changePercentage: -30,
            IconComponent: TrendingDown,
          },
        ]}
      />
    </div>
  );
};

export default Dashboard;
