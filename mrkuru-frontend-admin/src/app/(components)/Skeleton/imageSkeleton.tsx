export default function ImageSkeleton() {
  return (
    <div className="absolute inset-0 z-0 animate-pulse">
      <div className="w-full h-full bg-gray-200 rounded-xl" />
    </div>
  );
}
