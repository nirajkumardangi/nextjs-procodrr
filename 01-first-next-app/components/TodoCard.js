export default function TodoCard({ todo }) {
  return (
    <div
      className={`max-w-md p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
        todo.completed
          ? "bg-green-50 border-green-500"
          : "bg-white border-blue-500"
      }`}
    >
      {/* Header with IDs */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-500">
          Todo #{todo.id}
        </span>
        <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
          User {todo.userId}
        </span>
      </div>

      {/* Todo Content */}
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <div
          className={`flex-shrink-0 w-5 h-5 rounded border-2 mt-0.5 ${
            todo.completed ? "bg-green-500 border-green-500" : "border-gray-300"
          }`}
        >
          {todo.completed && (
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* Title */}
        <div className="flex-1">
          <h3
            className={`text-lg font-medium leading-tight ${
              todo.completed ? "text-green-800 line-through" : "text-gray-900"
            }`}
          >
            {todo.title}
          </h3>

          {/* Status Badge */}
          <span
            className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
              todo.completed
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {todo.completed ? "Completed" : "Pending"}
          </span>
        </div>
      </div>
    </div>
  );
}
