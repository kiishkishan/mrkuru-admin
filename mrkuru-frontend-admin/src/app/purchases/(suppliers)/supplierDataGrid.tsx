/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import {
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useGetSuppliersQuery,
} from "@/state/api";
import { useAppSelector } from "@/app/redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material";
import { Edit3, Trash2 } from "lucide-react";
import CreateButton from "@/app/(components)/Button/createButton";
import CreateSupplierForm from "./createSupplierForm";
import { showToast } from "@/state/thunks/alertThunk";
import { useAppDispatch } from "@/app/redux";
import Modal from "@/app/(components)/Modal";

interface SupplierForm {
  supplierName: string;
  supplierContact: string;
  supplierAddress: string;
}

const SuppliersDataGrid = () => {
  const [isCreateAreaOpen, setIsCreateAreaOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const {
    data: suppliers,
    isLoading,
    isError,
    refetch,
  } = useGetSuppliersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [createSupplier] = useCreateSupplierMutation();
  const [deleteSupplier] = useDeleteSupplierMutation();

  const dispatch = useAppDispatch();

  const handleOpenModal = useCallback((supplierId: string) => {
    setSelectedProduct(supplierId);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedProduct) {
      try {
        await deleteSupplier(selectedProduct).unwrap();
        setIsModalOpen(false);

        // Show a success toast
        dispatch(showToast("Supplier deleted successfully!", "success"));

        // Refetch products after deleting
        await refetch();
      } catch (error: any) {
        console.error("Failed to delete supplier:", error.data);
        const errorMessage = error?.data || "Failed to delete supplier.";

        // Show an error toast
        dispatch(showToast(errorMessage, "error"));
      }
    }
  };

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
    {
      field: "supplierAddress",
      headerName: "Supplier Address",
      renderHeader: () => <p className="font-bold">Supplier Address</p>,
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
      renderCell: (params) => {
        return (
          <div className="flex items-center justify-center gap-2 w-full h-full">
            <Edit3 className="w-9 h-9 p-2 bg-white hover:bg-blue-200 text-gray-600 hover:text-gray-900 rounded-md shadow transition duration-200" />
            <Trash2
              className="w-9 h-9 p-2 bg-gray-50 hover:bg-red-100 text-red-600 rounded-md shadow transition duration-200"
              onClick={() => handleOpenModal(params?.row?.supplierId)}
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

  const toggleCreateSupplier = () => setIsCreateAreaOpen((prev) => !prev);

  const handleCreateSupplier = async (supplierData: SupplierForm) => {
    try {
      await createSupplier(supplierData);
      console.log("Supplier created:", supplierData);
      dispatch(showToast("Supplier created successfully!", "success"));
    } catch (error) {
      console.error("Failed to create supplier:", error);
      dispatch(
        showToast("Failed to create supplier. Please try again.", "error")
      );
    }
    setIsCreateAreaOpen(false);
    refetch();
  };

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
          <CreateButton
            name="Create Supplier"
            onClickCreate={toggleCreateSupplier}
          />
        </div>
        {isCreateAreaOpen && (
          <CreateSupplierForm onCreate={handleCreateSupplier} />
        )}
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={suppliers}
            columns={columns}
            getRowId={(row) => row?.supplierId}
            className={`bg-white w-full xl:w-fit overflow-x-hidden shadow rounded-lg border border-gray-200 mt-5 !text-gray-700`}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 },
              },
            }}
            pageSizeOptions={[3, 5, 10]}
          />
        </ThemeProvider>
      </>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        >
          <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
          <p className="mb-6">Are you sure you want to delete this Supplier?</p>
        </Modal>
      )}
    </div>
  );
};

export default SuppliersDataGrid;
