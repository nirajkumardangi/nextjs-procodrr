export default function Loading() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Loading Todos...</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="max-w-md p-6 rounded-lg shadow-lg border-l-4 border-blue-500 bg-white"
          >
            {/* Header skeleton */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <div className="shimmer h-4 w-20 rounded"></div>
              <div className="shimmer h-4 w-24 rounded-full"></div>
            </div>

            {/* Content skeleton */}
            <div className="flex items-start space-x-3">
              {/* Checkbox skeleton */}
              <div className="shimmer flex-shrink-0 w-5 h-5 rounded mt-0.5"></div>

              {/* Text skeleton */}
              <div className="flex-1 space-y-3">
                <div className="shimmer h-5 w-full rounded"></div>
                <div className="shimmer h-5 w-4/5 rounded"></div>
                <div className="shimmer h-6 w-20 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
