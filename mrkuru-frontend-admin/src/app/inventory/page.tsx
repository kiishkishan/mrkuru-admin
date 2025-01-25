"use client";

import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useHoldSellingProductMutation,
} from "@/state/api";
import React, { useState } from "react";
import Header from "@/app/(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Rating from "../(components)/Rating";
import {
  BadgeInfo,
  Boxes,
  CircleDollarSign,
  Inbox,
  Trash2,
} from "lucide-react";
import { useAppSelector } from "../redux";
import { createTheme, ThemeProvider } from "@mui/material";
import Modal from "@/app/(components)/Modal";

interface ProductID {
  productId: string;
}

const Inventory = () => {
  const { data: products, isError, isLoading } = useGetProductsQuery();
  const [holdSellingProduct] = useHoldSellingProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // redux states
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  // local usestate
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handleHoldSelling = async ({ productId }: ProductID) => {
    console.log({ productId }, "handleHoldSelling");

    await holdSellingProduct({ productId });
  };

  // Delete Confirmation Modal related functions
  const handleOpenModal = (productId: string) => {
    setSelectedProduct(productId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      console.log("delete selected product", selectedProduct);
      // await deleteProduct({ productId: selectedProduct });
      setIsModalOpen(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Product Name",
      width: isSidebarCollapsed ? 300 : 220,
      renderHeader: () => (
        <div className="flex items-center justify-between w-full">
          <Inbox
            strokeWidth={1.25}
            fill="#707070"
            fillOpacity={0.4}
            className="w-7 h-7"
          />
          &nbsp;
          <p className="font-bold">Product Name</p>
        </div>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 130,
      type: "number",
      align: "center",
      cellClassName: "font-semibold",
      headerAlign: "center",
      renderHeader: () => (
        <div className="flex items-center justify-between w-full">
          <CircleDollarSign
            strokeWidth={1.25}
            fill="#707070"
            fillOpacity={0.4}
            className="w-7 h-7"
          />
          &nbsp;
          <p className="font-bold">Price</p>
        </div>
      ),
      valueGetter: (value, row) => `${row?.price}`,
      valueFormatter: (value, row) =>
        `${
          row?.price >= 10000
            ? new Intl.NumberFormat("en-US").format(row.price)
            : row?.price
        } LKR`,
      sortable: true,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 140,
      type: "number",
      align: "center",
      headerAlign: "center",
      renderHeader: () => (
        <div className="flex items-center justify-center w-full">
          <h2 className="font-bold">Rating</h2>
        </div>
      ),
      valueGetter: (value, row) => (row.rating ? row.rating : "N/A"),
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center align-middle h-full w-full">
            <Rating rating={params.value || 0} />
          </div>
        );
      },
    },
    {
      field: "details",
      headerName: "Details",
      width: isSidebarCollapsed ? 300 : 220,
      type: "string",
      headerAlign: "center",
      renderHeader: () => (
        <div className="flex items-center justify-center w-full">
          <h2 className="font-bold">Details</h2>
        </div>
      ),
      valueGetter: (value, row) => `${row?.details}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 135,
      type: "string",
      align: "center",
      headerAlign: "center",
      renderHeader: () => (
        <div className="flex items-center justify-center w-full">
          <BadgeInfo
            strokeWidth={1.25}
            fill="#707070"
            fillOpacity={0.4}
            className="w-7 h-7"
          />
          &nbsp;
          <p className="font-bold">Status</p>
        </div>
      ),
      renderCell: (params) => {
        const status = params?.row?.ProductStatus.status || "N/A";

        let bgColor = "bg-gray-300 text-gray-800"; // Default color for unknown status

        // Apply custom background color based on status
        if (status === "In Stock") bgColor = "bg-green-200 text-green-800";
        else if (status === "Out of Stock") bgColor = "bg-red-200 text-red-800";
        else if (status === "Limited")
          bgColor = "bg-yellow-200 text-yellow-800";

        return (
          <div className="flex items-center justify-center h-full w-full">
            <div
              className={`flex items-center w-full justify-center px-2 py-1.5 rounded-xl text-sm font-semibold ${bgColor}`}
            >
              {status}
            </div>
          </div>
        );
      },
    },
    {
      field: "stockQuantity",
      headerName: "Stock Quantity",
      width: 200,
      type: "number",
      align: "center",
      cellClassName: "font-semibold",
      headerAlign: "center",
      renderHeader: () => (
        <div className="flex items-center justify-center w-full">
          <Boxes
            strokeWidth={1.25}
            fill="#707070"
            fillOpacity={0.4}
            className="w-7 h-7"
          />
          &nbsp;
          <p className="font-bold">Stock Quantity</p>
        </div>
      ),
      valueGetter: (value, row) => `${row?.stockQuantity}`,
      valueFormatter: (value, row) => `${row?.stockQuantity} Stocks`,
    },
    // actions column
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderHeader: () => (
        <div className="flex items-center justify-center w-full">
          <p className="font-bold">Actions</p>
        </div>
      ),
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center gap-2 w-full h-full">
            {/* Hold Selling Button */}
            <button
              className="px-3 py-2 bg-gray-50 hover:bg-gray-200 font-semibold rounded-md text-sm shadow"
              onClick={() =>
                handleHoldSelling({
                  productId: params?.row?.productId,
                })
              }
            >
              Hold Selling
            </button>

            {/* Delete Button */}
            <Trash2
              className="w-9 h-9 p-2 bg-gray-50 hover:bg-red-100 text-red-600 rounded-md shadow"
              onClick={() => handleOpenModal(params?.row?.productId)}
            />
          </div>
        );
      },
    },
  ];

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      background: {
        default: isDarkMode ? "#000" : "#ffff",
      },
    },
  });

  console.log(products, "products in inventory");

  if (isLoading) {
    return <div className="py-4 animate-pulse">Loading...</div>;
  }

  if (isError || !products) {
    return (
      <div className="py-4 text-red-500 text-center text-lg font-bold">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="flex flex-col ">
      <Header name="Inventory" />
      <ThemeProvider theme={theme}>
        <DataGrid
          rows={products}
          columns={columns}
          getRowId={(row) => row?.productId}
          className="bg-white shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
        />
      </ThemeProvider>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        >
          <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
          <p className="mb-6">Are you sure you want to delete this product?</p>
        </Modal>
      )}
    </div>
  );
};

export default Inventory;
