import React from "react";

type SubHeadingSkeletonProps = {
  style?: string;
};

const SubHeadingSkeleton = ({ style }: SubHeadingSkeletonProps) => {
  return (
    <div className={`bg-gray-200 ${style} animate-pulse rounded-md`}></div>
  );
};

export default SubHeadingSkeleton;
