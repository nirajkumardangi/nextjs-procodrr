export default function PostCard({ post }) {
  return (
    <div className="max-w-md p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header with ID */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-500">
          Post #{post.id}
        </span>
        <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          User {post.userId}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
        {post.title}
      </h2>

      {/* Body */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
        {post.body.replace(/\\n/g, " ")}
      </p>

      {/* Footer Action */}
      <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
        Read More
      </button>
    </div>
  );
}
