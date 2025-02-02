export default function ProductCardSkeleton() {
  return (
    <div className="border border-gray-100 shadow-lg hover:shadow-xl rounded-xl p-6 max-w-full w-full mx-auto bg-gradient-to-b from-white to-gray-50 transition-all duration-300 hover:-translate-y-1.5">
      <div className="flex flex-col space-y-4 animate-pulse">
        {/* Image Skeleton */}
        <div className="h-32 w-full rounded-md bg-gray-200"></div>

        {/* Title Skeleton */}
        <div className="flex justify-center">
          <div className="h-6 w-3/4 rounded bg-gray-200"></div>
        </div>

        {/* Price Skeleton */}
        <div className="flex justify-center">
          <div className="h-6 w-1/4 rounded bg-gray-200"></div>
        </div>

        {/* Stock Info Skeleton */}
        <div className="flex justify-center">
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        </div>

        {/* Description Skeleton */}
        <div className="flex justify-center">
          <div className="h-4 w-full rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
