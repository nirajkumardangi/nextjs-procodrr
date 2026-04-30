# 📚 Complete Next.js Course Notes — SET 3

### Videos 21–30 | By Anurag Singh (ProCodrr)

---

# 🔄 VIDEO 21: Dynamically Rendering Static Pages in Next.js (S3 Ep.6)

## The Core Concept

> Sometimes you need a page that is **mostly static** but has **some dynamic parts**. Next.js provides ways to handle this efficiently.

## The Problem

```
Scenario:
- Product page is static (pre-built at build time)
- BUT shopping cart count needs to be dynamic (per user)
- AND stock availability needs real-time data

Solution: Partial rendering strategies
```

## `unstable_noStore`

> Opt out of static rendering for a **specific component** without making the whole page dynamic.

```jsx
import { unstable_noStore as noStore } from "next/cache";

async function StockStatus({ productId }) {
  noStore(); // ← This component renders dynamically

  const res = await fetch(`https://api.example.com/stock/${productId}`);
  const stock = await res.json();

  return (
    <div>
      {stock.available ? (
        <span style={{ color: "green" }}>In Stock</span>
      ) : (
        <span style={{ color: "red" }}>Out of Stock</span>
      )}
    </div>
  );
}
```

## Combining Static and Dynamic Parts

```jsx
// app/products/[id]/page.js
// The PAGE itself is static
// But specific parts can be dynamic via Suspense

import { Suspense } from "react";

// Static part - pre-rendered at build time
async function ProductDetails({ id }) {
  const res = await fetch(`https://api.example.com/products/${id}`, {
    cache: "force-cache", // Static
  });
  const product = await res.json();

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
    </div>
  );
}

// Dynamic part - rendered per request
async function StockInfo({ id }) {
  const res = await fetch(`https://api.example.com/stock/${id}`, {
    cache: "no-store", // Dynamic
  });
  const stock = await res.json();

  return <p>Stock: {stock.quantity} remaining</p>;
}

// Main page - combines both
export default async function ProductPage({ params }) {
  const { id } = await params;

  return (
    <div>
      {/* Static - renders at build time */}
      <ProductDetails id={id} />

      {/* Dynamic - renders per request, wrapped in Suspense */}
      <Suspense fallback={<p>Checking stock...</p>}>
        <StockInfo id={id} />
      </Suspense>
    </div>
  );
}
```

## Route Segment Config Options

```jsx
// Control rendering behavior at route level

// Force the entire route to be static
export const dynamic = "force-static";

// Force the entire route to be dynamic
export const dynamic = "force-dynamic";

// Set revalidation time
export const revalidate = 60;

// Control fetch cache behavior
export const fetchCache = "force-cache";
```

## `export const dynamic` Explained:

```jsx
// 'auto' (default) - Next.js decides based on code
export const dynamic = "auto";

// 'force-dynamic' - Always dynamic (like SSR)
export const dynamic = "force-dynamic";

// 'force-static' - Always static (ignores dynamic functions)
export const dynamic = "force-static";

// 'error' - Throw error if dynamic rendering needed
export const dynamic = "error";
```

## Practical Example - News + Ads Page:

```jsx
// app/news/page.js
import { Suspense } from "react";

// Static news content
async function NewsArticles() {
  const res = await fetch("https://api.example.com/news", {
    next: { revalidate: 3600 }, // ISR - revalidate hourly
  });
  const articles = await res.json();

  return (
    <div>
      {articles.map((article) => (
        <article key={article.id}>
          <h2>{article.title}</h2>
          <p>{article.summary}</p>
        </article>
      ))}
    </div>
  );
}

// Dynamic personalized content
async function PersonalizedAds() {
  const res = await fetch("https://api.example.com/ads", {
    cache: "no-store", // Always fresh
  });
  const ads = await res.json();

  return (
    <aside>
      {ads.map((ad) => (
        <div key={ad.id}>{ad.content}</div>
      ))}
    </aside>
  );
}

export default function NewsPage() {
  return (
    <div style={{ display: "flex" }}>
      {/* Static/ISR news content */}
      <Suspense fallback={<p>Loading news...</p>}>
        <NewsArticles />
      </Suspense>

      {/* Dynamic ads sidebar */}
      <Suspense fallback={<p>Loading ads...</p>}>
        <PersonalizedAds />
      </Suspense>
    </div>
  );
}
```

---

# 🌊 VIDEO 22: Streaming in Next.js (S3 Ep.7)

## What is Streaming?

> **Streaming** allows you to send parts of the page to the browser **progressively** as they become ready, instead of waiting for ALL content before sending anything.

## Traditional SSR vs Streaming:

```
Traditional SSR:
────────────────
Server: Wait for ALL data → Generate complete HTML → Send everything
User waits: [============================] Then sees everything at once

Streaming:
──────────
Server: Send HTML chunks as they're ready
User sees: [Part 1]──[Part 2]──[Part 3] progressively

Like watching a video stream vs downloading then watching!
```

## How Streaming Works in Next.js:

```
1. Server starts sending HTML immediately
2. Parts wrapped in <Suspense> stream in as data loads
3. Browser renders each chunk as it arrives
4. User sees content progressively
```

## `loading.js` — Route-Level Streaming

> Create a `loading.js` file to show a loading UI while the page loads.

```jsx
// app/dashboard/loading.js
export default function DashboardLoading() {
  return (
    <div>
      {/* Skeleton loader */}
      <div
        style={{
          background: "#e0e0e0",
          height: "40px",
          width: "200px",
          borderRadius: "4px",
          marginBottom: "16px",
          animation: "pulse 1.5s infinite",
        }}
      ></div>

      <div
        style={{
          background: "#e0e0e0",
          height: "200px",
          borderRadius: "4px",
          animation: "pulse 1.5s infinite",
        }}
      ></div>
    </div>
  );
}
```

```jsx
// app/dashboard/page.js
// loading.js automatically shows while this page loads
async function DashboardPage() {
  // Simulating slow data fetch
  const res = await fetch("https://api.example.com/dashboard", {
    cache: "no-store",
  });
  const data = await res.json();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {data.totalUsers}</p>
      <p>Revenue: ${data.revenue}</p>
    </div>
  );
}

export default DashboardPage;
```

## `<Suspense>` for Component-Level Streaming

> `<Suspense>` gives you **granular control** over what streams when.

```jsx
// app/page.js
import { Suspense } from "react";

// Slow component - takes 3 seconds
async function SlowComponent() {
  // Simulate slow API
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const res = await fetch("https://api.example.com/slow-data");
  const data = await res.json();

  return <div>Slow Data: {data.value}</div>;
}

// Fast component - takes 100ms
async function FastComponent() {
  const res = await fetch("https://api.example.com/fast-data");
  const data = await res.json();

  return <div>Fast Data: {data.value}</div>;
}

export default function Page() {
  return (
    <div>
      <h1>My Page</h1>

      {/* Shows immediately */}
      <Suspense fallback={<div>Loading fast data...</div>}>
        <FastComponent />
      </Suspense>

      {/* Streams in after 3 seconds */}
      <Suspense fallback={<div>Loading slow data...</div>}>
        <SlowComponent />
      </Suspense>
    </div>
  );
}
```

## Skeleton Loading Pattern:

```jsx
// components/ProductSkeleton.jsx
function ProductSkeleton() {
  return (
    <div
      style={{ border: "1px solid #ddd", padding: "16px", borderRadius: "8px" }}
    >
      {/* Image skeleton */}
      <div
        style={{
          background: "#e0e0e0",
          height: "200px",
          borderRadius: "4px",
          marginBottom: "12px",
        }}
      />

      {/* Title skeleton */}
      <div
        style={{
          background: "#e0e0e0",
          height: "20px",
          width: "80%",
          borderRadius: "4px",
          marginBottom: "8px",
        }}
      />

      {/* Price skeleton */}
      <div
        style={{
          background: "#e0e0e0",
          height: "16px",
          width: "40%",
          borderRadius: "4px",
        }}
      />
    </div>
  );
}

// Loading multiple skeletons
export function ProductGridSkeleton() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: "16px",
      }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
```

```jsx
// app/products/page.js
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/ProductSkeleton";

async function ProductGrid() {
  const res = await fetch("https://fakestoreapi.com/products");
  const products = await res.json();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: "16px",
      }}
    >
      {products.map((product) => (
        <div
          key={product.id}
          style={{ border: "1px solid #ddd", padding: "16px" }}
        >
          <img
            src={product.image}
            alt={product.title}
            style={{ width: "100%", height: "200px", objectFit: "contain" }}
          />
          <h3>{product.title}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div>
      <h1>Our Products</h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
    </div>
  );
}
```

## Streaming Benefits:

```
Without Streaming:
User waits 3 seconds → Sees complete page at once

With Streaming:
0ms  → Sees page shell (header, layout)
100ms → Sees fast components
3000ms → Sees slow components stream in

Much better user experience! 🎉
```

---

# 🖥️ VIDEO 23: Client Components vs Server Components (S3 Ep.8)

## The Fundamental Difference

```
React Server Components (RSC) — Run on SERVER:
✅ Can fetch data directly (async/await)
✅ Access server-side resources (DB, file system)
✅ Keep sensitive data on server
✅ Reduce client-side JS bundle
❌ Cannot use useState, useEffect
❌ Cannot use browser APIs
❌ Cannot handle user interactions directly
❌ Cannot use Context (consuming)

Client Components — Run in BROWSER:
✅ Can use useState, useEffect, useRef
✅ Can handle events (onClick, onChange)
✅ Can access browser APIs
✅ Can use Context
❌ Cannot be async (no direct async/await)
❌ Larger JS bundle
❌ No direct server resource access
```

## Default Behavior:

```jsx
// All components in Next.js App Router are SERVER COMPONENTS by default
// No directive needed

// server-component.jsx ← Server Component (default)
async function ServerComponent() {
  // Can fetch data directly!
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();

  return <div>{data.title}</div>;
}
```

```jsx
// To make a CLIENT COMPONENT add 'use client' at the top
"use client";

import { useState } from "react";

function ClientComponent() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

## Detailed Comparison with Examples:

### Server Component — Data Fetching:

```jsx
// app/users/page.js — Server Component
// No 'use client' = Server Component

async function UsersPage() {
  // Runs on SERVER — API key safe!
  const res = await fetch("https://api.example.com/users", {
    headers: {
      Authorization: `Bearer ${process.env.API_SECRET_KEY}`, // Safe!
    },
  });
  const users = await res.json();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPage;
```

### Client Component — Interactivity:

```jsx
// components/Counter.jsx — Client Component
"use client";

import { useState, useEffect } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    // Browser API — only works client-side
    setTime(new Date().toLocaleTimeString());

    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>Current Time: {time}</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <button onClick={() => setCount((c) => c - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

## The Component Tree Rule:

```
Once you add 'use client' to a component,
ALL its children become client components too
(even without 'use client' directive)

Server Component Tree:
─────────────────────
Page (Server)
├── Header (Server)
├── ProductList (Server)   ← Can fetch data
│   └── ProductCard (Server)
└── Footer (Server)

Mixed Tree:
──────────
Page (Server)
├── Header (Server)
├── ProductList (Server)   ← Still fetches data
│   └── ProductCard (Server)
└── CartButton (Client) ← 'use client'
    └── CartCount (Client) ← Automatically client!
```

## Passing Data from Server to Client:

```jsx
// app/page.js — Server Component
import ClientComponent from "./ClientComponent";

async function ServerPage() {
  // Fetch on server
  const res = await fetch("https://api.example.com/products");
  const products = await res.json();

  // Pass as props to client component
  return (
    <div>
      <h1>Products</h1>
      {/* Pass server data to client as props */}
      <ClientComponent products={products} />
    </div>
  );
}

export default ServerPage;
```

```jsx
// components/ClientComponent.jsx
"use client";
import { useState } from "react";

export default function ClientComponent({ products }) {
  // Receives server data via props
  const [filter, setFilter] = useState("");

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Filter products..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ul>
        {filtered.map((p) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Props Must Be Serializable:

```jsx
// ✅ These can be passed as props (serializable)
<ClientComponent
  name="John"           // string ✅
  age={25}             // number ✅
  isActive={true}      // boolean ✅
  data={{ key: 'val' }}// plain object ✅
  items={[1, 2, 3]}   // array ✅
/>

// ❌ These CANNOT be passed as props (not serializable)
<ClientComponent
  fn={() => {}}         // function ❌
  date={new Date()}    // Date object ❌ (use string instead)
  map={new Map()}      // Map ❌
/>
```

## When to Use Which:

```
Use SERVER Component when:
✅ Fetching data from API/database
✅ Accessing environment variables
✅ Component doesn't need interactivity
✅ SEO critical content
✅ Large dependencies (stays on server, not sent to browser)

Use CLIENT Component when:
✅ Need useState, useReducer, useEffect
✅ Event listeners (onClick, onChange)
✅ Browser APIs (localStorage, geolocation)
✅ Real-time updates
✅ Custom hooks that use state/effects
```

---

# 💧 VIDEO 24: What is Hydration in Next.js? (S3 Ep.9)

## What is Hydration?

> **Hydration** is the process where React takes the static HTML (generated by the server) and **attaches JavaScript event handlers** to make it interactive on the client side.

## The Hydration Process:

```
Step 1: Server renders HTML
────────────────────────────
Server sends: <button>Count: 0</button>
Browser displays the button immediately (fast!)

Step 2: JavaScript downloads
────────────────────────────
Browser downloads React + your component JS

Step 3: Hydration happens
────────────────────────────
React "takes over" the static HTML
Attaches onClick handlers
Syncs React state with DOM
Button is now INTERACTIVE!
```

## Visual Representation:

```
Server renders:
<div>
  <h1>Hello World</h1>
  <button>Click me: 0</button>    ← Static, not interactive
</div>

After Hydration:
<div>
  <h1>Hello World</h1>
  <button onClick={handleClick}>Click me: 0</button>  ← Now interactive!
</div>
```

## Code Example:

```jsx
// This component gets:
// 1. HTML rendered on server (static)
// 2. Hydrated on client (becomes interactive)

"use client";
import { useState } from "react";

export default function HydratedButton() {
  // Initial state (0) must match what server rendered
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* This HTML was rendered on server */}
      {/* After hydration, onClick works */}
      <button onClick={() => setCount((c) => c + 1)}>
        Clicked: {count} times
      </button>
    </div>
  );
}
```

## Phases of Page Load:

```
Timeline:
─────────────────────────────────────────────────────
0ms    → Browser receives static HTML from server
         User sees content (but can't interact)

~100ms → React JS bundle starts downloading

~500ms → Hydration begins
         React reconciles server HTML with client React tree

~600ms → Page fully interactive
         All event handlers attached
```

## Server Components Don't Hydrate:

```jsx
// Server Component — NO hydration needed
// Stays as static HTML, no JS sent to browser
async function ServerComponent() {
  const data = await fetch("/api/data");
  const json = await data.json();

  return <p>{json.title}</p>;
  // This is just HTML — no JS needed in browser!
}

// Client Component — Hydration required
("use client");
function ClientComponent() {
  const [x, setX] = useState(0);
  return <button onClick={() => setX(x + 1)}>{x}</button>;
  // This needs JS for onClick → hydration required
}
```

## The Benefit of Hydration Strategy:

```
Without Next.js (Pure CSR):
Browser: Downloads JS → Executes JS → Renders HTML → Interactive
User waits: Long white screen before seeing anything ❌

With Next.js (SSR + Hydration):
Server: Renders HTML
Browser: Shows content IMMEDIATELY
Then: Downloads JS → Hydrates → Interactive
User sees content instantly ✅
```

---

# ⚠️ VIDEO 25: Why Hydration Errors Come in Next.js (S3 Ep.10)

## What is a Hydration Error?

> A **hydration error** occurs when the HTML generated by the server **doesn't match** what React generates on the client during hydration.

```
Server renders:  <p>Hello World</p>
Client renders:  <p>Hello Universe</p>
                         ↑ MISMATCH!
Result: Hydration Error ❌
```

## Common Causes of Hydration Errors:

### Cause 1: Using Browser-Only APIs in Server Render

```jsx
// ❌ WRONG — Causes hydration error
"use client";

export default function BadComponent() {
  // window is not available on server!
  // Server renders: undefined
  // Client renders: 1920
  const width = window.innerWidth;

  return <p>Window width: {width}</p>;
}
```

```jsx
// ✅ CORRECT — Use useEffect for browser APIs
"use client";
import { useState, useEffect } from "react";

export default function GoodComponent() {
  const [width, setWidth] = useState(0); // Safe initial value

  useEffect(() => {
    // Only runs on client (after hydration)
    setWidth(window.innerWidth);

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <p>Window width: {width}</p>;
}
```

### Cause 2: Date/Time Differences

```jsx
// ❌ WRONG — Server time ≠ Client time
"use client";

export default function BadTimeComponent() {
  // Server renders at time T
  // Client renders at time T+500ms
  // They don't match → Hydration error!
  const time = new Date().toLocaleTimeString();

  return <p>Current time: {time}</p>;
}
```

```jsx
// ✅ CORRECT — Use useEffect for time
"use client";
import { useState, useEffect } from "react";

export default function GoodTimeComponent() {
  const [time, setTime] = useState(""); // Empty initial = safe

  useEffect(() => {
    // Set time only on client
    setTime(new Date().toLocaleTimeString());
  }, []);

  // Shows nothing until hydrated (or use a placeholder)
  return <p>Current time: {time || "Loading..."}</p>;
}
```

### Cause 3: Random Values

```jsx
// ❌ WRONG — Random value differs between server and client
"use client";

export default function BadRandom() {
  const randomId = Math.random(); // Different each render!

  return <div id={`item-${randomId}`}>Content</div>;
}
```

```jsx
// ✅ CORRECT — Use useId hook
"use client";
import { useId } from "react";

export default function GoodRandom() {
  const id = useId(); // Consistent across server and client

  return <div id={id}>Content</div>;
}
```

### Cause 4: localStorage Access

```jsx
// ❌ WRONG — localStorage doesn't exist on server
"use client";

export default function BadLocalStorage() {
  // localStorage is undefined on server → Error!
  const theme = localStorage.getItem("theme") || "light";

  return <div className={theme}>Content</div>;
}
```

```jsx
// ✅ CORRECT — Check for browser environment
"use client";
import { useState, useEffect } from "react";

export default function GoodLocalStorage() {
  const [theme, setTheme] = useState("light"); // Default for server

  useEffect(() => {
    // Safe to access localStorage after hydration
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  return <div className={theme}>Content</div>;
}
```

### Cause 5: Invalid HTML Nesting

```jsx
// ❌ WRONG — <p> cannot contain <div>
export default function BadNesting() {
  return (
    <p>
      <div>Nested div in p tag</div> {/* Invalid HTML! */}
    </p>
  );
}
```

```jsx
// ✅ CORRECT — Proper HTML nesting
export default function GoodNesting() {
  return (
    <div>
      <p>Paragraph text</p>
      <div>Div content</div>
    </div>
  );
}
```

## Suppressing Hydration Warnings:

```jsx
// Use ONLY when you intentionally want different server/client output
// Example: Theme based on user preference

export default function Layout({ children }) {
  return (
    <html
      suppressHydrationWarning // ← Suppresses warning for this element only
    >
      <body>{children}</body>
    </html>
  );
}
```

## `dynamic` Import to Skip SSR:

```jsx
// For components that CANNOT work on server
import dynamic from "next/dynamic";

// This component only renders on client (skips SSR)
const ClientOnlyMap = dynamic(() => import("./Map"), {
  ssr: false, // ← Don't render on server at all
  loading: () => <p>Loading map...</p>,
});

export default function Page() {
  return (
    <div>
      <h1>Location</h1>
      <ClientOnlyMap /> {/* No hydration error! */}
    </div>
  );
}
```

## Quick Debug Checklist:

```
When you see hydration error, check:

1. ❓ Using window/document/localStorage without useEffect?
2. ❓ Using Math.random() in render?
3. ❓ Using new Date() in render?
4. ❓ Invalid HTML nesting? (<p> inside <p>, <div> inside <p>)
5. ❓ Browser extensions modifying DOM?
6. ❓ Different data between server/client fetch?
```

---

# 📡 VIDEO 26: Data Fetching in Client Components (S4 Ep.1)

## Why Client-Side Fetching?

```
Use client-side fetching when:
✅ Data is user-specific (after auth)
✅ Data changes in real-time
✅ Data depends on user interaction
✅ Data depends on browser state
```

## Method 1: useEffect + fetch (Basic)

```jsx
"use client";
import { useState, useEffect } from "react";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTodos() {
      try {
        setLoading(true);
        const res = await fetch("https://jsonplaceholder.typicode.com/todos");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setTodos(data.slice(0, 10)); // First 10 todos
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTodos();
  }, []);

  if (loading) return <div>Loading todos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {todos.map((todo) => (
        <li
          key={todo.id}
          style={{ textDecoration: todo.completed ? "line-through" : "none" }}
        >
          {todo.title}
        </li>
      ))}
    </ul>
  );
}
```

## Method 2: Custom useFetch Hook

```jsx
// app/_hooks/useFetch.js
"use client";
import { useState, useEffect } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController(); // For cleanup

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(url, {
          signal: controller.signal, // Cancel on unmount
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const json = await res.json();
        setData(json);
      } catch (err) {
        // Ignore abort errors
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Cleanup: cancel fetch if component unmounts
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
```

```jsx
// Using the custom hook
"use client";
import { useFetch } from "@/app/_hooks/useFetch";

export default function PostsList() {
  const {
    data: posts,
    loading,
    error,
  } = useFetch("https://jsonplaceholder.typicode.com/posts");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {posts?.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

## Fetching with User Interaction:

```jsx
"use client";
import { useState } from "react";

export default function SearchUsers() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`https://api.example.com/users?search=${query}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

# 🌐 VIDEO 27: Data Fetching in Server Components (S4 Ep.2)

## Server Component Data Fetching

> In Server Components, you can fetch data **directly** using async/await — no hooks needed!

## Basic Server-Side Fetch:

```jsx
// app/posts/page.js — Server Component
export default async function PostsPage() {
  // Runs on SERVER — no loading state needed!
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await res.json();

  return (
    <div>
      <h1>All Posts</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  );
}
```

## Fetch Caching Strategies:

```jsx
// 1. Static (default) — cached forever (SSG behavior)
const res = await fetch(url);
const res = await fetch(url, { cache: "force-cache" });

// 2. Dynamic — no cache (SSR behavior)
const res = await fetch(url, { cache: "no-store" });

// 3. ISR — revalidate periodically
const res = await fetch(url, { next: { revalidate: 60 } });

// 4. Tag-based revalidation
const res = await fetch(url, { next: { tags: ["posts"] } });
```

## Fetching from Database (Direct Access):

```jsx
// app/users/page.js — Server Component
// Can directly access databases! No API needed!
import { db } from "@/lib/database";

export default async function UsersPage() {
  // Direct database access — secure, no API key exposure
  const users = await db.query("SELECT * FROM users");

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## Request Deduplication:

> Next.js automatically **deduplicates** identical fetch requests!

```jsx
// Even if BOTH functions call the same URL,
// Next.js only makes ONE actual HTTP request!

async function getUser(id) {
  const res = await fetch(`https://api.example.com/users/${id}`);
  return res.json();
}

// In generateMetadata
export async function generateMetadata({ params }) {
  const { id } = await params;
  const user = await getUser(id); // Fetch #1
  return { title: user.name };
}

// In the page component
export default async function UserPage({ params }) {
  const { id } = await params;
  const user = await getUser(id); // Same fetch — DEDUPLICATED! ✅

  return <h1>{user.name}</h1>;
}
```

## Sequential vs Parallel Fetching:

```jsx
// ❌ Sequential — slow! (waterfall)
async function SequentialPage() {
  const user = await fetchUser(1); // Wait 1 second
  const posts = await fetchPosts(user.id); // Wait another second
  // Total: 2 seconds

  return <div>{/* render */}</div>;
}

// ✅ Parallel — fast!
async function ParallelPage() {
  const [user, posts] = await Promise.all([
    fetchUser(1), // Both start
    fetchPosts(1), // at same time!
  ]);
  // Total: ~1 second (longest one)

  return <div>{/* render */}</div>;
}
```

---

# ⏳ VIDEO 28: Handling Loading State While Fetching Data (S4 Ep.3)

## Loading States in Next.js

### Method 1: `loading.js` File

```jsx
// app/products/loading.js
// Automatically shown while products/page.js is loading

export default function ProductsLoading() {
  return (
    <div>
      <h1>Products</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "16px",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: "#e0e0e0",
              height: "300px",
              borderRadius: "8px",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

```jsx
// app/products/page.js
// loading.js shows AUTOMATICALLY while this loads

export default async function ProductsPage() {
  // Simulate slow fetch
  const res = await fetch("https://fakestoreapi.com/products", {
    cache: "no-store",
  });
  const products = await res.json();

  return (
    <div>
      <h1>Products</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "16px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{ border: "1px solid #ddd", padding: "16px" }}
          >
            <h3>{product.title}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### How `loading.js` Works Internally:

```jsx
// Next.js automatically wraps your page with Suspense:
// This is what Next.js does BEHIND THE SCENES

<Suspense fallback={<Loading />}>
  {" "}
  {/* from loading.js */}
  <Page /> {/* your page.js */}
</Suspense>
```

### Method 2: Client-Side Loading State

```jsx
"use client";
import { useState } from "react";

export default function FetchButton() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleFetch() {
    setLoading(true);
    try {
      const res = await fetch("https://api.example.com/data");
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleFetch} disabled={loading}>
        {loading ? <span>Loading... ⏳</span> : <span>Fetch Data</span>}
      </button>

      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

---

# 🔮 VIDEO 29: Using Suspense to Handle Loading State (S4 Ep.4)

## Suspense Deep Dive

> `<Suspense>` lets you show a **fallback UI** while waiting for async operations. It gives you **granular control** over loading states for individual components.

## Basic Suspense Usage:

```jsx
import { Suspense } from "react";

// Slow async component
async function SlowData() {
  const res = await fetch("https://api.example.com/slow", {
    cache: "no-store",
  });
  const data = await res.json();
  return <div>{data.value}</div>;
}

// Fast async component
async function FastData() {
  const res = await fetch("https://api.example.com/fast", {
    cache: "no-store",
  });
  const data = await res.json();
  return <div>{data.value}</div>;
}

export default function Page() {
  return (
    <div>
      <h1>My Dashboard</h1>

      {/* Independent loading states! */}
      <Suspense fallback={<div>Loading fast data...</div>}>
        <FastData />
      </Suspense>

      <Suspense fallback={<div>Loading slow data...</div>}>
        <SlowData />
      </Suspense>
    </div>
  );
}
```

## Suspense vs loading.js Comparison:

```
loading.js:
- Works at ROUTE level
- Entire page shows loading state
- Simpler to implement
- Less granular

<Suspense>:
- Works at COMPONENT level
- Individual components show loading state
- More complex but more flexible
- Very granular control
```

## Nested Suspense:

```jsx
import { Suspense } from "react";

async function UserProfile({ userId }) {
  const res = await fetch(`https://api.example.com/users/${userId}`);
  const user = await res.json();

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>

      {/* Nested Suspense */}
      <Suspense fallback={<div>Loading user's posts...</div>}>
        <UserPosts userId={userId} />
      </Suspense>
    </div>
  );
}

async function UserPosts({ userId }) {
  const res = await fetch(`https://api.example.com/users/${userId}/posts`);
  const posts = await res.json();

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <UserProfile userId={1} />
    </Suspense>
  );
}
```

---

# ⚡ VIDEO 30: Parallel Data Fetching in Next.js (S4 Ep.5)

## The Waterfall Problem

```
Sequential (Bad) — Waterfall pattern:
─────────────────────────────────────
Fetch User:   [====] 1s
              ↓ Wait for user
Fetch Posts:       [====] 1s
                   ↓ Wait for posts
Fetch Comments:         [====] 1s
Total: 3 seconds ❌

Parallel (Good):
──────────────────────────────────────
Fetch User:    [====] 1s
Fetch Posts:   [====] 1s
Fetch Comments:[====] 1s
Total: 1 second ✅ (3x faster!)
```

## Method 1: `Promise.all`

```jsx
// app/dashboard/page.js

async function fetchUser(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  return res.json();
}

async function fetchPosts(userId) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`,
  );
  return res.json();
}

async function fetchTodos(userId) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos?userId=${userId}`,
  );
  return res.json();
}

export default async function DashboardPage() {
  const userId = 1;

  // Fetch ALL in parallel!
  const [user, posts, todos] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId),
    fetchTodos(userId),
  ]);

  return (
    <div>
      <h1>Dashboard for {user.name}</h1>

      <section>
        <h2>Posts ({posts.length})</h2>
        {posts.slice(0, 3).map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
          </div>
        ))}
      </section>

      <section>
        <h2>Todos ({todos.length})</h2>
        {todos.slice(0, 3).map((todo) => (
          <div
            key={todo.id}
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {todo.title}
          </div>
        ))}
      </section>
    </div>
  );
}
```

## Method 2: Parallel with Suspense (Best Pattern)

```jsx
// app/dashboard/page.js
import { Suspense } from "react";

// Each component fetches its own data
async function UserInfo({ userId }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
  );
  const user = await res.json();
  return (
    <div>
      <h2>User: {user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

async function UserPosts({ userId }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?userId=${userId}`,
  );
  const posts = await res.json();
  return (
    <div>
      <h2>Posts: {posts.length}</h2>
      {posts.slice(0, 3).map((p) => (
        <p key={p.id}>{p.title}</p>
      ))}
    </div>
  );
}

async function UserTodos({ userId }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos?userId=${userId}`,
  );
  const todos = await res.json();
  return (
    <div>
      <h2>Todos: {todos.length}</h2>
      {todos.slice(0, 3).map((t) => (
        <p
          key={t.id}
          style={{ textDecoration: t.completed ? "line-through" : "none" }}
        >
          {t.title}
        </p>
      ))}
    </div>
  );
}

// Main page — all components fetch IN PARALLEL
// Each shows its own loading state independently
export default function DashboardPage() {
  const userId = 1;

  return (
    <div>
      <h1>Dashboard</h1>

      {/* All three fetch in PARALLEL */}
      <Suspense fallback={<div>Loading user info...</div>}>
        <UserInfo userId={userId} />
      </Suspense>

      <Suspense fallback={<div>Loading posts...</div>}>
        <UserPosts userId={userId} />
      </Suspense>

      <Suspense fallback={<div>Loading todos...</div>}>
        <UserTodos userId={userId} />
      </Suspense>
    </div>
  );
}
```

## `Promise.allSettled` for Independent Data:

```jsx
// When you want SOME data even if one request fails
export default async function RobustPage() {
  const results = await Promise.allSettled([
    fetch("https://api.example.com/users").then((r) => r.json()),
    fetch("https://api.example.com/products").then((r) => r.json()),
    fetch("https://api.example.com/orders").then((r) => r.json()),
  ]);

  const [usersResult, productsResult, ordersResult] = results;

  return (
    <div>
      {usersResult.status === "fulfilled" ? (
        <div>Users: {usersResult.value.length}</div>
      ) : (
        <div>Failed to load users</div>
      )}

      {productsResult.status === "fulfilled" ? (
        <div>Products: {productsResult.value.length}</div>
      ) : (
        <div>Failed to load products</div>
      )}

      {ordersResult.status === "fulfilled" ? (
        <div>Orders: {ordersResult.value.length}</div>
      ) : (
        <div>Failed to load orders</div>
      )}
    </div>
  );
}
```

---

# 📝 SET 3 — Quick Revision Cheatsheet

```
┌──────────────────────────────────────────────────────────────┐
│                    NEXT.JS SET 3 SUMMARY                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  STREAMING:                                                  │
│  loading.js → Route-level loading UI                         │
│  <Suspense fallback={<Skeleton/>}> → Component-level         │
│  Streams content progressively to browser                    │
│                                                              │
│  SERVER vs CLIENT COMPONENTS:                                │
│  Server: async, fetch data, no hooks, no interactivity       │
│  Client: 'use client', useState, useEffect, events           │
│  Default = Server Component                                  │
│  Children of 'use client' = auto client components           │
│                                                              │
│  HYDRATION:                                                  │
│  Server renders HTML → JS downloads → React attaches         │
│  Hydration Error = Server HTML ≠ Client HTML                 │
│  Fixes: useEffect for browser APIs, useId, ssr:false         │
│                                                              │
│  DATA FETCHING:                                              │
│  Client: useEffect + fetch / useFetch custom hook            │
│  Server: async component + await fetch()                     │
│  Deduplication: Same fetch URL = one request                 │
│                                                              │
│  LOADING STATES:                                             │
│  loading.js → Automatic Suspense wrapper                     │
│  <Suspense fallback={...}> → Manual control                  │
│                                                              │
│  PARALLEL FETCHING:                                          │
│  Promise.all([fetch1, fetch2, fetch3])                       │
│  Multiple <Suspense> components (auto parallel)              │
│  Promise.allSettled() → Don't fail on one error              │
│                                                              │
│  DYNAMIC vs STATIC RENDERING TRIGGERS:                       │
│  Static: force-cache (default)                               │
│  Dynamic: no-store, cookies(), headers(), searchParams       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```
