import React, { useState } from "react";
import {
  useCreatePurchaseStatusMutation,
  useGetPurchaseStatusQuery,
} from "@/state/api";
import { useAppSelector } from "@/app/redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material";
import { Edit3, Trash2 } from "lucide-react";
import CreateButton from "@/app/(components)/Button/createButton";
import CreatePurchaseStatusForm from "./createPurchaseStatusForm";

interface PurchaseStatusForm {
  purchaseStatusId?: string;
  status: string;
}

const PurchaseStatusDataGrid = () => {
  const [isCreateAreaOpen, setIsCreateAreaOpen] = useState(false);
  const {
    data: purchaseStatus,
    isLoading,
    isError,
    refetch,
  } = useGetPurchaseStatusQuery();
  const [createPurchaseStatus] = useCreatePurchaseStatusMutation();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const columns: GridColDef[] = [
    {
      field: "purchaseStatusId",
      headerName: "Purchase Status ID",
      width: 280,
      renderHeader: () => <p className="font-bold">Purchase Status ID</p>,
    },
    {
      field: "status",
      headerName: "Status",
      align: "center",
      headerAlign: "center",
      cellClassName: "font-semibold",
      renderHeader: () => <p className="font-bold">Status</p>,
      width: 180,
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

  // form actions
  const toggleCreatePurchaseStatus = () => setIsCreateAreaOpen((prev) => !prev);

  const handleCreatePurchaseStatus = async (
    purchaseStatusData: PurchaseStatusForm
  ) => {
    try {
      console.log("purchaseStatusData", purchaseStatusData);
      await createPurchaseStatus(purchaseStatusData);
      setIsCreateAreaOpen(false);
      // Optionally, you can add success handling here
    } catch (error) {
      console.error("Failed to create product", error);
      // Optionally, you can add error handling here
    }
    setTimeout(() => {
      refetch();
    }, 1000);
  };

  if (isLoading) {
    return <div className="py-4 animate-pulse">Loading...</div>;
  }

  if (isError && !isLoading && !purchaseStatus) {
    return (
      <div className="py-4 text-red-500 text-center text-lg font-bold">
        Failed to fetch Purchase Status
      </div>
    );
  }

  return (
    <div className="mt-5">
      <p className="text-base font-semibold text-gray-700">
        List of Purchase Status
      </p>
      <>
        <div className="flex justify-start mb-4 mt-5">
          <CreateButton
            name="Create Purchase Status"
            onClickCreate={toggleCreatePurchaseStatus}
          />
        </div>
        {isCreateAreaOpen && (
          <CreatePurchaseStatusForm onCreate={handleCreatePurchaseStatus} />
        )}
        <ThemeProvider theme={theme}>
          <div className="w-full overflow-auto">
            <DataGrid
              rows={purchaseStatus}
              columns={columns}
              getRowId={(row) => row?.purchaseStatusId}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 },
                },
              }}
              pageSizeOptions={[3, 5, 10]}
              className={`bg-white w-full lg:w-fit overflow-x-hidden shadow rounded-lg border border-gray-200 mt-5 !text-gray-700`}
            />
          </div>
        </ThemeProvider>
      </>
    </div>
  );
};

export default PurchaseStatusDataGrid;
