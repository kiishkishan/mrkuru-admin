/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useGetPurchasesQuery } from "@/state/api";
import { useAppSelector } from "@/app/redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material";
import { format } from "date-fns";
import { Download, Edit3, Trash2, X } from "lucide-react";
import CreateButton from "@/app/(components)/Button/createButton";
import SubHeadingSkeleton from "@/app/(components)/Skeleton/subHeadingSkeleton";
import DataGridSkeleton from "@/app/(components)/Skeleton/dataGridSkeleton";
import PurchaseOrderDocument from "@/app/purchases/(purchases)/purchaseOrderDocument";
import { usePDF } from "@react-pdf/renderer";

// type PurchaseProps = {
//   purchaseId: string;
//   timeStamp: string;
//   Suppliers: {
//     supplierId: string;
//     supplierName: string;
//     supplierAddress: string;
//     supplierContact: string;
//   };
//   PurchaseStatus: {
//     purchaseStatusId: string;
//     status: string;
//   };
//   PurchaseDetails: PurchaseDetailProps[];
//   subTotal: number;
//   amountPaid: number;
// };

// type PurchaseDetailProps = {
//   purchaseDetailsId: string;
//   unitPrice: number;
//   totalPrice: number;
//   qty: number;
//   Products: {
//     productId: string;
//     name: string;
//     price: number;
//     stockQuantity: number;
//   };
// };

const PurchasesDataGrid = () => {
  const { data: purchases, isLoading, isError } = useGetPurchasesQuery();

  // redux states
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal State

  // PDF
  const [instance, update] = usePDF({
    document: <PurchaseOrderDocument purchases={selectedPurchase} />,
  });

  useEffect(() => {
    if (selectedPurchase) {
      update(<PurchaseOrderDocument purchases={selectedPurchase} />);
    }
  }, [selectedPurchase, update]);

  const openModal = (purchase: object) => {
    setSelectedPurchase(purchase);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const columns: GridColDef[] = [
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
      width: 180,
      valueGetter: (value, row) => `${row?.Suppliers.supplierName}`,
    },
    {
      field: "purchaseStatus",
      headerName: "Status",
      renderHeader: () => <p className="font-bold">Status</p>,
      width: 120,
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
      renderCell: (params) => (
        <div className="flex items-center justify-center self-center w-full h-full gap-2">
          {/* Export as CSV Button */}
          <button
            onClick={() => {
              // Add CSV export logic here
              console.log("Export as CSV");
            }}
            className="flex items-center justify-center px-3 py-2 bg-white hover:bg-gray-400 text-gray-600 hover:text-gray-900 font-semibold rounded-md text-sm shadow-md transition duration-200"
          >
            CSV
            <Download className="ml-2 w-4 h-4" />
          </button>

          {/* Export as PDF Button */}
          <button
            onClick={() => openModal(params.row)}
            className="flex items-center justify-center px-3 py-2 bg-white hover:bg-gray-400 text-gray-600 hover:text-gray-900 font-semibold rounded-md text-sm shadow-md transition duration-200"
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
      width: 250,
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
          <div className="flex items-center justify-center gap-3 w-full h-full">
            {/* Hold Selling Button */}
            <button className="px-3 py-2 bg-white hover:bg-gray-200 font-semibold rounded-md text-sm shadow-md transition duration-200">
              Change Status
            </button>
            <Edit3 className="w-9 h-9 p-2 bg-white hover:bg-blue-200 text-gray-600 hover:text-gray-900 rounded-md shadow-md transition duration-200" />
            <Trash2 className="w-9 h-9 p-2 bg-white hover:bg-red-100 text-red-600 rounded-md shadow-md transition duration-200 " />
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
    if (isLoading) {
      return (
        <div className="flex flex-col mt-5 gap-4">
          <SubHeadingSkeleton style="w-1/4 h-6" />
          <SubHeadingSkeleton style="w-2/5 h-8 justify-end " />
          <DataGridSkeleton rows={2} style="w-full overflow-x-hidden" />
        </div>
      );
    }
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 p-5 rounded-lg shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Purchase Order Preview
            </h2>

            {/* PDF Preview */}
            {instance.url ? (
              <iframe
                src={instance.url}
                className="w-full h-96 border rounded-lg"
              ></iframe>
            ) : (
              <p className="text-center text-gray-500">
                Generating PDF preview...
              </p>
            )}

            {/* Download PDF */}
            <div className="mt-4 flex justify-end">
              <a
                href={instance.url || ""}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasesDataGrid;
