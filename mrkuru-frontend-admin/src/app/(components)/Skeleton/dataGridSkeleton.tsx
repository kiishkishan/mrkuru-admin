import React from "react";

type DataGridSkeletonProps = {
  rows: number;
  style: string;
};

const DataGridSkeleton = ({ rows, style }: DataGridSkeletonProps) => {
  return (
    <div className={` ${style} mt-5 space-y-2`}>
      {/* Header Shimmer */}
      <div className="h-10 bg-gray-300 animate-pulse rounded-md"></div>
      {/* Rows Shimmer */}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="h-10 bg-gray-200 animate-pulse rounded-md"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default DataGridSkeleton;
