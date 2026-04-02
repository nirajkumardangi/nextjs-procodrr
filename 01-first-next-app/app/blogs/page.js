"use client";

import PostCard from "@/components/PostCard";
import { useEffect, useState } from "react";

// export const metadata = {
//   title: "Blogs",
// };

export default function Blogs() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=10",
      );
      const data = await response.json();
      setPosts(data);
    }

    fetchPosts();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">All Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
