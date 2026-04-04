"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function Error({ reset }) {
  const router = useRouter();

  return (
    <main>
      <p>⚠️</p>

      <h1>Something went wrong</h1>

      <p>
        We couldn’t load this blog post. It may have been deleted, or the server
        is temporarily unavailable.
      </p>

      <p>
        <Link href="/blogs">Back to blogs</Link>
      </p>

      <button
        onClick={() =>
          startTransition(() => {
            router.refresh(); // 🔁 fetch fresh data
            reset(); // 🔄 clear error UI
          })
        }
      >
        Try again
      </button>
    </main>
  );
}
