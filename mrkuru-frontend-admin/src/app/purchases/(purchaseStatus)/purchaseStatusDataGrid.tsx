import React, { useCallback, useState } from "react";
import {
  useCreatePurchaseStatusMutation,
  useDeletePurchaseStatusMutation,
  useGetPurchaseStatusQuery,
} from "@/state/api";
import { useAppSelector } from "@/app/redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material";
import { Edit3, Trash2 } from "lucide-react";
import CreateButton from "@/app/(components)/Button/createButton";
import CreatePurchaseStatusForm from "@/app/purchases/(purchaseStatus)/createPurchaseStatusForm";
import { showToast } from "@/state/thunks/alertThunk";
import { useAppDispatch } from "@/app/redux";
import Modal from "@/app/(components)/Modal";
import DataGridSkeleton from "@/app/(components)/Skeleton/dataGridSkeleton";
import SubHeadingSkeleton from "@/app/(components)/Skeleton/subHeadingSkeleton";

interface PurchaseStatusForm {
  purchaseStatusId?: string;
  status: string;
}

const PurchaseStatusDataGrid = () => {
  const [isCreateAreaOpen, setIsCreateAreaOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const dispatch = useAppDispatch();

  const {
    data: purchaseStatus,
    isLoading,
    isError,
    refetch,
  } = useGetPurchaseStatusQuery();
  const [createPurchaseStatus] = useCreatePurchaseStatusMutation();
  const [deletePurchaseStatus] = useDeletePurchaseStatusMutation();

  const handleOpenModal = useCallback((purchaseStatusId: string) => {
    setSelectedProduct(purchaseStatusId);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      try {
        console.log("selectedProduct purchaseStatusId", selectedProduct);

        await deletePurchaseStatus(selectedProduct).unwrap();
        setIsModalOpen(false);

        // Show a success toast
        dispatch(showToast("Purchase Status deleted successfully!", "success"));

        // Refetch products after deleting
        await refetch();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Failed to delete purchase status:", error);

        // Show an error toast
        const errorMessage = error?.data || "Failed to delete purchase status.";

        // Show an error toast
        dispatch(showToast(errorMessage, "error"));
      }
    }
  };

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
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center gap-2 w-full h-full">
            <Edit3 className="w-9 h-9 p-2 bg-white hover:bg-blue-200 text-gray-600 hover:text-gray-900 rounded-md shadow transition duration-200" />
            <Trash2
              className="w-9 h-9 p-2 bg-gray-50 hover:bg-red-100 text-red-600 rounded-md shadow transition duration-200"
              onClick={() => handleOpenModal(params?.row?.purchaseStatusId)}
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

  // form actions
  const toggleCreatePurchaseStatus = () => setIsCreateAreaOpen((prev) => !prev);

  const handleCreatePurchaseStatus = async (
    purchaseStatusData: PurchaseStatusForm
  ) => {
    try {
      console.log("purchaseStatusData", purchaseStatusData);
      await createPurchaseStatus(purchaseStatusData);
      setIsCreateAreaOpen(false);
      dispatch(showToast("Purchase Status created successfully", "success"));
    } catch (error) {
      console.error("Failed to create product", error);
      dispatch(showToast("Failed to create Purchase Status", "error"));
    }
    setTimeout(() => {
      refetch();
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col mt-5 gap-4">
        <SubHeadingSkeleton style="w-1/4 h-6" />
        <SubHeadingSkeleton style="w-2/5 h-8 " />
        <DataGridSkeleton rows={2} style="w-full lg:w-fit overflow-x-hidden" />
      </div>
    );
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

export default PurchaseStatusDataGrid;
