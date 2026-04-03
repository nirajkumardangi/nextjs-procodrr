"use client";

import Link from "next/link";

export default function Error() {
  return (
    <main>
      <div>
        <p>⚠️</p>
        <h1>Something went wrong</h1>
        <p>
          We couldn’t load this blog post. It may have been deleted, or the
          server is temporarily unavailable.
        </p>
        <p>
          <Link href="/blogs">Back to blogs</Link>
        </p>
        <p>
          <Link href="" replace>
            Try again
          </Link>
        </p>
      </div>
    </main>
  );
}
