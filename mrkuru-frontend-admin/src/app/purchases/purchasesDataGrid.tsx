import React from "react";
import { useGetPurchasesQuery } from "@/state/api";
import { useAppSelector } from "@/app/redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material";
import { format } from "date-fns";
import { Download, Edit3, Trash2 } from "lucide-react";
import CreateButton from "../(components)/Button/createButton";

const PurchasesDataGrid = () => {
  const { data: purchases, isLoading, isError } = useGetPurchasesQuery();

  // redux states
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const columns: GridColDef[] = [
    {
      field: "purchaseId",
      headerName: "Purchase ID",
      width: isSidebarCollapsed ? 260 : 140,
      renderHeader: () => <p className="font-bold">Purchase ID</p>,
    },
    {
      field: "timeStamp",
      headerName: "Time Stamp",
      renderHeader: () => <p className="font-bold">Time Stamp</p>,
      width: 150,
      renderCell: (params) => {
        const formattedDate = format(
          new Date(params.value),
          "yyyy-MM-dd HH:mm"
        );
        return <div>{formattedDate}</div>;
      },
    },
    {
      field: "supplier",
      headerName: "Supplier",
      renderHeader: () => <p className="font-bold">Supplier</p>,
      width: 160,
      valueGetter: (value, row) => `${row?.Suppliers.supplierName}`,
    },
    {
      field: "purchaseStatus",
      headerName: "Status",
      renderHeader: () => <p className="font-bold">Status</p>,
      width: 110,
      valueGetter: (value, row) => `${row?.PurchaseStatus?.status}`,
    },
    {
      field: "subTotal",
      headerName: "Sub Total",
      headerAlign: "center",
      renderHeader: () => <p className="font-bold">Sub Total</p>,
      width: isSidebarCollapsed ? 150 : 125,
      cellClassName: "font-semibold",
      align: "center",
      renderCell: (params) => {
        const formattedSubTotal = Intl.NumberFormat("en-US").format(
          params?.row?.subTotal
        );
        return <div>{formattedSubTotal}</div>;
      },
    },
    {
      field: "amountPaid",
      headerName: "Amount Paid",
      headerAlign: "center",
      renderHeader: () => <p className="font-bold">Amount Paid</p>,
      width: isSidebarCollapsed ? 155 : 145,
      cellClassName: "font-semibold",
      align: "center",
      renderCell: (params) => {
        const formattedSubTotal = Intl.NumberFormat("en-US").format(
          params?.row?.amountPaid
        );
        return <div>{formattedSubTotal}</div>;
      },
    },
    {
      field: "PurchaseDetails",
      headerName: "Purchase Details",
      align: "center",
      headerAlign: "center",
      renderHeader: () => <p className="font-bold">TPP</p>,
      width: isSidebarCollapsed ? 103.9 : 100,
      cellClassName: "font-semibold",
      valueGetter: (value, row) => `${row?.PurchaseDetails?.length}`,
    },
    // export actions column
    {
      field: "export",
      headerName: "Export",
      headerAlign: "center",
      renderHeader: () => <p className="font-bold">Export</p>,
      width: 150,
      align: "center",
      renderCell: () => (
        <div className="flex items-center justify-center self-center w-full h-full gap-2">
          {/* Export as CSV Button */}
          <button
            onClick={() => {
              // Add CSV export logic here
              console.log("Export as CSV");
            }}
            className="flex items-center justify-center px-3 py-2 bg-white hover:bg-gray-400 text-gray-600 hover:text-gray-900 font-semibold rounded-md text-sm shadow transition duration-200"
          >
            CSV
            <Download className="ml-2 w-4 h-4" />
          </button>

          {/* Export as PDF Button */}
          <button
            onClick={() => {
              // Add PDF export logic here
              console.log("Export as PDF");
            }}
            className="flex items-center justify-center px-3 py-2 bg-white hover:bg-gray-400 text-gray-600 hover:text-gray-900 font-semibold rounded-md text-sm shadow transition duration-200"
          >
            PDF
            <Download className="ml-2 w-4 h-4" />
          </button>
        </div>
      ),
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

  if (isError && !isLoading && !purchases) {
    return (
      <div className="py-4 text-red-500 text-center text-lg font-bold">
        Failed to fetch purchases
      </div>
    );
  }
  return (
    <div className="mt-7">
      <div className="flex justify-between items-center">
        <p className="text-base font-semibold text-gray-700">
          List of Purchases
        </p>
        <CreateButton name="Create Purchase" />
      </div>
      <ThemeProvider theme={theme}>
        <DataGrid
          rows={purchases}
          columns={columns}
          getRowId={(row) => row?.purchaseId}
          className="bg-white w-full shadow rounded-lg border border-gray-200 mt-5 !text-gray-700"
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 15, 20]}
        />
      </ThemeProvider>
      <p className="px-2 py-1.5 font-semibold text-gray-600 text-sm text-right">
        ** TPP = Total Products Purchased
      </p>
    </div>
  );
};

export default PurchasesDataGrid;
