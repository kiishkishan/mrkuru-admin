import React from "react";
import { useGetSuppliersQuery } from "@/state/api";
import { useAppSelector } from "@/app/redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material";
import { Edit3, Trash2 } from "lucide-react";
import CreateButton from "@/app/(components)/Button/createButton";

const SuppliersDataGrid = () => {
  const { data: suppliers, isLoading, isError } = useGetSuppliersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const columns: GridColDef[] = [
    {
      field: "supplierId",
      headerName: "Supplier ID",
      width: 280,
      renderHeader: () => <p className="font-bold">Supplier ID</p>,
    },
    {
      field: "supplierName",
      headerName: "Supplier Name",
      renderHeader: () => <p className="font-bold">Supplier Name</p>,
      width: 180,
    },
    {
      field: "supplierContact",
      headerName: "Supplier Contact",
      renderHeader: () => <p className="font-bold">Supplier Contact</p>,
      width: 200,
    },
    // actions column
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderHeader: () => (
        <div className="flex items-center justify-center w-full">
          <p className="font-bold">Actions</p>
        </div>
      ),
      renderCell: () => {
        return (
          <div className="flex items-center justify-center gap-2 w-full h-full">
            <Edit3 className="w-9 h-9 p-2 bg-white hover:bg-blue-200 text-gray-600 hover:text-gray-900 rounded-md shadow transition duration-200" />
            <Trash2 className="w-9 h-9 p-2 bg-gray-50 hover:bg-red-100 text-red-600 rounded-md shadow transition duration-200" />
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

  if (isLoading) {
    return <div className="py-4 animate-pulse">Loading...</div>;
  }

  if (isError && !isLoading && !suppliers) {
    return (
      <div className="py-4 text-red-500 text-center text-lg font-bold">
        Failed to fetch suppliers
      </div>
    );
  }
  return (
    <div className="mt-5">
      <p className="text-base font-semibold text-gray-700">List of Suppliers</p>
      <>
        <div className="flex justify-start mb-4 mt-5">
          <CreateButton name="Create Supplier" />
        </div>
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={suppliers}
            columns={columns}
            getRowId={(row) => row?.supplierId}
            className="bg-white w-full lg:w-fit shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
          />
        </ThemeProvider>
      </>
    </div>
  );
};

export default SuppliersDataGrid;
