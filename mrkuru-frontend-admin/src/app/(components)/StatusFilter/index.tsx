import React from "react";

type StatusFilterProps = {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
};

const StatusFilter = ({
  statusFilter,
  onStatusFilterChange,
}: StatusFilterProps) => {
  return (
    <div>
      <div className="flex w-fit items-center border bg-gray-100 justify-start gap-4 py-2 px-2 mt-5">
        <button
          className={`px-4 py-2 font-semibold text-sm ${
            statusFilter === "All"
              ? " bg-gray-50 text-gray-900 shadow-md"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          onClick={() => onStatusFilterChange("All")}
        >
          All
        </button>

        <button
          className={`px-4 py-2 font-semibold text-sm ${
            statusFilter === "In Stock"
              ? " bg-gray-50 text-gray-900 shadow-md"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          onClick={() => onStatusFilterChange("In Stock")}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 font-semibold text-sm ${
            statusFilter === "On Hold"
              ? " bg-gray-50 text-gray-900 shadow-md"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          onClick={() => onStatusFilterChange("On Hold")}
        >
          On Hold
        </button>
        <button
          className={`px-4 py-2 font-semibold text-sm ${
            statusFilter === "Out of Stock"
              ? " bg-gray-50 text-gray-900 shadow-md"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
          onClick={() => onStatusFilterChange("Out of Stock")}
        >
          Out of Stock
        </button>
      </div>
    </div>
  );
};

export default StatusFilter;
