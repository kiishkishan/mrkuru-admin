/* eslint-disable @typescript-eslint/no-explicit-any */
import SubHeadingSkeleton from "@/app/(components)/Skeleton/subHeadingSkeleton";
import {
  useGetPurchaseStatusQuery,
  useUpdatePurchaseStatusMutation,
} from "@/state/api";
import { showToast } from "@/state/thunks/alertThunk";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useAppDispatch } from "@/app/redux";

type PurchaseStatusChangeModalProps = {
  onClose: () => void;
  selectedRow: any;
};

const PurchaseStatusChangeModal = ({
  onClose,
  selectedRow,
}: PurchaseStatusChangeModalProps) => {
  const {
    data: purchaseStatus,
    isLoading,
    isError,
    refetch,
  } = useGetPurchaseStatusQuery();

  const [updatePurchaseStatus, { isLoading: isUpdating }] =
    useUpdatePurchaseStatusMutation();

  const [selectedStatus, setSelectedStatus] = useState("");

  const existingStatus = selectedRow?.PurchaseStatus?.purchaseStatusId;

  const dispatch = useAppDispatch();

  if (isLoading && !purchaseStatus) {
    return <SubHeadingSkeleton />;
  }

  if (isError && !isLoading && !purchaseStatus) {
    return (
      <div className="py-4 text-red-500 text-center text-lg font-bold">
        Failed to fetch Purchase Status
      </div>
    );
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("handleStatusChange", e.target.value);
    setSelectedStatus(e.target.value);
  };

  const handleSave = async () => {
    try {
      console.log("updatePurchaseStatus selectedStatus", selectedStatus);
      await updatePurchaseStatus({
        purchaseId: selectedRow?.purchaseId,
        targetStatusId: selectedStatus,
      });
      onClose();
      dispatch(showToast("Purchase status updated successfully", "success"));
      refetch();
    } catch (error) {
      console.error("Error updating purchase status:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Change Purchase Status
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Content */}
        <div className="mt-6">
          <label
            htmlFor="status-select"
            className="block text-sm font-medium text-gray-700"
          >
            Select Status
          </label>
          <select
            id="status-select"
            defaultValue={existingStatus || ""}
            onChange={handleStatusChange}
            className="mt-2 block w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm sm:text-sm transition-all duration-200 ease-in-out focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-80 appearance-none cursor-pointer hover:border-gray-400"
          >
            {purchaseStatus?.map((item: any) => (
              <option key={item.purchaseStatusId} value={item.purchaseStatusId}>
                {item.status}
              </option>
            ))}
          </select>
        </div>
        {/* Footer */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md
              ${isUpdating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}
              focus:outline-none focus:ring focus:ring-black shadow-md transition-all duration-300 transform hover:scale-105`}
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseStatusChangeModal;
