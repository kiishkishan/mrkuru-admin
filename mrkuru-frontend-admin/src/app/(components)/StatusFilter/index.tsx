import React from "react";

type StatusFilterProps = {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  statusFilterItems: Array<string>;
};

const StatusFilter = ({
  statusFilter,
  onStatusFilterChange,
  statusFilterItems,
}: StatusFilterProps) => {
  return (
    <div>
      <div className="flex flex-wrap w-fit items-center border bg-gray-100 justify-start gap-4 py-2 px-2 mt-5">
        {statusFilterItems.map((status, index) => (
          <button
            key={index}
            className={`px-4 py-2 font-semibold text-sm ${
              statusFilter === status
                ? " bg-gray-50 text-gray-900 shadow-md"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => onStatusFilterChange(status)}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;
