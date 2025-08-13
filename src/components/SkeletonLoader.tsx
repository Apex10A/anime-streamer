export default function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="relative overflow-hidden rounded-lg bg-gray-800/50 border border-gray-700/50">
        <div className="aspect-[3/4] bg-gray-700/50"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-700/50 rounded mb-2"></div>
          <div className="h-3 bg-gray-700/50 rounded w-3/4 mb-2"></div>
          <div className="flex gap-1 mb-2">
            <div className="h-5 bg-gray-700/50 rounded-full w-12"></div>
            <div className="h-5 bg-gray-700/50 rounded-full w-16"></div>
          </div>
          <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}