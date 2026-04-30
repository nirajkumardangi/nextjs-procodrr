# 📚 Complete Next.js Course Notes — SET 2

### Videos 11–20 | By Anurag Singh (ProCodrr)

---

# 🏗️ VIDEO 11: Building Reusable Layouts in Next.js (S2 Ep.6)

## What is a Layout?

> A **Layout** is a UI component that is **shared between multiple pages**. It wraps page content and **persists across navigations** — meaning it does NOT re-render when you switch between pages.

## Why Layouts Matter?

```
Without Layouts:                    With Layouts:
─────────────────────────────────────────────────
Every page re-renders navbar  →   Navbar renders ONCE
Every page re-renders footer  →   Footer renders ONCE
State lost on navigation      →   State preserved
Poor performance              →   Better performance
```

## Root Layout (Required)

> `app/layout.js` is **mandatory** in every Next.js App Router project. It must contain `<html>` and `<body>` tags.

```jsx
// app/layout.js — Root Layout
// This wraps EVERY page in your application

export const metadata = {
  title: "My Next.js App",
  description: "A complete Next.js application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/blog">Blog</a>
          </nav>
        </header>

        <main>
          {children} {/* Page content renders here */}
        </main>

        <footer>
          <p>© 2024 My App. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
```

## Nested Layouts

> You can create layouts at **any level** of your folder structure. They **nest inside** the root layout.

### Folder Structure:

```
app/
├── layout.js                ← Root Layout (wraps everything)
├── page.js                  → /
├── dashboard/
│   ├── layout.js            ← Dashboard Layout (wraps dashboard pages)
│   ├── page.js              → /dashboard
│   ├── analytics/
│   │   └── page.js          → /dashboard/analytics
│   └── settings/
│       └── page.js          → /dashboard/settings
└── blog/
    ├── layout.js            ← Blog Layout (wraps blog pages)
    ├── page.js              → /blog
    └── [id]/
        └── page.js          → /blog/123
```

### How Layouts Nest:

```
When visiting /dashboard/settings:

RootLayout
└── DashboardLayout
    └── SettingsPage content
```

### Dashboard Layout Example:

```jsx
// app/dashboard/layout.js
import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar — persists across dashboard pages */}
      <aside style={{ width: "250px", background: "#f0f0f0" }}>
        <h2>Dashboard Menu</h2>
        <nav>
          <ul>
            <li>
              <Link href="/dashboard">Overview</Link>
            </li>
            <li>
              <Link href="/dashboard/analytics">Analytics</Link>
            </li>
            <li>
              <Link href="/dashboard/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content — changes per page */}
      <div style={{ flex: 1, padding: "20px" }}>{children}</div>
    </div>
  );
}
```

```jsx
// app/dashboard/page.js
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard Overview</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}
```

```jsx
// app/dashboard/analytics/page.js
export default function AnalyticsPage() {
  return (
    <div>
      <h1>Analytics</h1>
      <p>Your analytics data here...</p>
    </div>
  );
}
```

### Blog Layout Example:

```jsx
// app/blog/layout.js
export default function BlogLayout({ children }) {
  return (
    <div>
      <div style={{ background: "#333", color: "white", padding: "10px" }}>
        <h2>📝 Blog Section</h2>
      </div>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>{children}</div>
    </div>
  );
}
```

## Important Layout Rules:

```
✅ Layout DOES:
- Persist state across navigations
- NOT re-render when navigating between child pages
- Accept 'children' prop
- Support metadata export

❌ Layout DOES NOT:
- Have access to the current pathname directly
  (use usePathname() hook in client component for that)
- Re-render on child page changes
```

## Getting Current Path in Layout:

```jsx
// components/NavBar.jsx — Client Component for active links
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <nav>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            fontWeight: pathname === link.href ? "bold" : "normal",
            color: pathname === link.href ? "blue" : "black",
          }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
```

```jsx
// app/layout.js — Use the client NavBar in server layout
import NavBar from "@/components/NavBar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar /> {/* Client component inside server layout ✅ */}
        <main>{children}</main>
      </body>
    </html>
  );
}
```

---

# 🏷️ VIDEO 12: Metadata API in Next.js (S2 Ep.7)

## What is Metadata?

> **Metadata** is information about your webpage that appears in the browser tab, search engine results, and social media previews. It's crucial for **SEO**.

```html
<!-- What metadata looks like in HTML -->
<head>
  <title>My Page Title</title>
  <meta name="description" content="Page description for SEO" />
  <meta property="og:title" content="Open Graph Title" />
  <meta property="og:image" content="/og-image.jpg" />
</head>
```

## Two Ways to Define Metadata in Next.js:

### 1. Static Metadata (Export Object)

```jsx
// app/about/page.js
export const metadata = {
  title: "About Us",
  description: "Learn more about our company and team",
};

export default function AboutPage() {
  return <h1>About Us</h1>;
}
```

### 2. Dynamic Metadata (Export Function)

```jsx
// app/products/[id]/page.js
// Use when metadata depends on dynamic data

export async function generateMetadata({ params }) {
  const { id } = await params;

  // Fetch data to create dynamic metadata
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const product = await res.json();

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const product = await res.json();

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
    </div>
  );
}
```

## Complete Metadata Object Reference:

```jsx
// app/page.js — Full metadata example
export const metadata = {
  // Basic
  title: "My Next.js App",
  description: "This is my amazing Next.js application",

  // Keywords (less important for modern SEO but still used)
  keywords: ["Next.js", "React", "JavaScript"],

  // Authors
  authors: [{ name: "Anurag Singh", url: "https://procodrr.com" }],

  // Canonical URL
  alternates: {
    canonical: "https://mysite.com",
  },

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    title: "My Next.js App",
    description: "This is my amazing Next.js application",
    url: "https://mysite.com",
    siteName: "My Site",
    images: [
      {
        url: "https://mysite.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "My Site Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "My Next.js App",
    description: "This is my amazing Next.js application",
    images: ["https://mysite.com/twitter-image.jpg"],
    creator: "@procodrr",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};
```

## Title Template

> Use `title.template` to create consistent titles across pages without repeating.

```jsx
// app/layout.js — Set title template in root layout
export const metadata = {
  title: {
    default: "My App", // Fallback if no title set
    template: "%s | My App", // %s = child page title
  },
  description: "My amazing application",
};
```

```jsx
// app/about/page.js
export const metadata = {
  title: "About", // Becomes: "About | My App"
};
```

```jsx
// app/products/page.js
export const metadata = {
  title: "Products", // Becomes: "Products | My App"
};
```

```jsx
// app/contact/page.js
export const metadata = {
  title: "Contact", // Becomes: "Contact | My App"
};
// If NO title exported → uses "My App" (default)
```

## Metadata Merging:

```
Root Layout metadata + Page metadata = MERGED metadata
(Page metadata overrides root metadata for same fields)

Root:  { title: 'My App', description: 'Root desc' }
Page:  { title: 'About' }
─────────────────────────────────────────────────────
Final: { title: 'About', description: 'Root desc' }
```

## `generateMetadata` with Data Fetching:

```jsx
// app/blog/[slug]/page.js

// Next.js automatically deduplicates fetch requests
// Same fetch in generateMetadata and the component won't fetch twice

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;

  const post = await getPost(slug); // Your data fetching function

  // Return metadata
  return {
    title: post?.title ?? "Blog Post Not Found",
    description: post?.excerpt ?? "Read our latest blog post",
    openGraph: {
      title: post?.title,
      description: post?.excerpt,
      type: "article",
      publishedTime: post?.publishedAt,
      authors: [post?.author],
    },
  };
}

// Helper function
async function getPost(slug) {
  const res = await fetch(`https://api.example.com/posts/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug); // Same fetch — DEDUPLICATED!

  if (!post) return <h1>Post not found</h1>;

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

---

# ❓ VIDEO 13: Custom Not Found Page in Next.js (S2 Ep.8)

## Default vs Custom 404

```
Default:  Next.js shows a basic "404 | This page could not be found" page
Custom:   You create your own branded not-found page
```

## Creating a Global Not Found Page:

```jsx
// app/not-found.js — Global 404 page
import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <Link href="/">Go back to Home</Link>
    </div>
  );
}
```

## Triggering Not Found Manually:

> Use the `notFound()` function from `next/navigation`

```jsx
// app/products/[id]/page.js
import { notFound } from "next/navigation";

export default async function ProductPage({ params }) {
  const { id } = await params;

  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const product = await res.json();

  // If product doesn't exist, show 404
  if (!product || product.id === undefined) {
    notFound(); // ← Triggers the not-found.js page
  }

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
    </div>
  );
}
```

## Nested Not Found Pages:

> You can create `not-found.js` at **any level** for section-specific 404 pages!

```
app/
├── not-found.js                ← Global 404
└── dashboard/
    ├── not-found.js            ← Dashboard-specific 404
    └── [id]/
        └── page.js
```

```jsx
// app/dashboard/not-found.js
import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div>
      <h1>Dashboard Item Not Found</h1>
      <p>The dashboard item you're looking for doesn't exist.</p>
      <Link href="/dashboard">Back to Dashboard</Link>
    </div>
  );
}
```

## Metadata for Not Found Page:

```jsx
// app/not-found.js
import Link from "next/link";

export const metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist",
};

export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <Link href="/">Return Home</Link>
    </div>
  );
}
```

## Complete Example — Product with Not Found:

```jsx
// app/users/[id]/page.js
import { notFound } from "next/navigation";
import Link from "next/link";

async function getUser(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    cache: "no-store",
  });

  // Check if response is OK
  if (!res.ok) return null;

  return res.json();
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    return { title: "User Not Found" };
  }

  return { title: `${user.name}'s Profile` };
}

export default async function UserPage({ params }) {
  const { id } = await params;
  const user = await getUser(id);

  // Trigger 404 if user not found
  if (!user) {
    notFound();
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Website: {user.website}</p>
      <Link href="/users">← Back to Users</Link>
    </div>
  );
}
```

---

# 📦 VIDEO 14: Route Groups in Next.js (S2 Ep.9)

## What are Route Groups?

> **Route Groups** let you **organize** your files and folders **without affecting the URL structure**. Created by wrapping folder names in **parentheses** `(folderName)`.

## Problem They Solve:

```
Without Route Groups — MESSY:
app/
├── layout.js                ← One layout for everything
├── page.js
├── login/page.js
├── register/page.js
├── dashboard/page.js
└── profile/page.js

Problem: login and register need different layout than dashboard!
```

```
With Route Groups — ORGANIZED:
app/
├── (auth)/
│   ├── layout.js            ← Auth layout (for login/register)
│   ├── login/page.js        → /login
│   └── register/page.js     → /register
├── (dashboard)/
│   ├── layout.js            ← Dashboard layout (sidebar etc.)
│   ├── dashboard/page.js    → /dashboard
│   └── profile/page.js      → /profile
└── layout.js                ← Root layout
```

> 🔑 **Key Point**: `(auth)` and `(dashboard)` do NOT appear in the URL!

## Implementation:

### Auth Group Layout:

```jsx
// app/(auth)/layout.js
export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          width: "400px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
```

```jsx
// app/(auth)/login/page.js
export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
// Accessible at: /login (NOT /(auth)/login)
```

```jsx
// app/(auth)/register/page.js
export default function RegisterPage() {
  return (
    <div>
      <h1>Create Account</h1>
      <form>
        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
// Accessible at: /register (NOT /(auth)/register)
```

### Dashboard Group Layout:

```jsx
// app/(dashboard)/layout.js
import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <aside
        style={{
          width: "200px",
          background: "#1a1a2e",
          color: "white",
          minHeight: "100vh",
        }}
      >
        <h2>App Menu</h2>
        <nav>
          <Link href="/dashboard" style={{ color: "white", display: "block" }}>
            📊 Dashboard
          </Link>
          <Link href="/profile" style={{ color: "white", display: "block" }}>
            👤 Profile
          </Link>
          <Link href="/settings" style={{ color: "white", display: "block" }}>
            ⚙️ Settings
          </Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: "20px" }}>{children}</main>
    </div>
  );
}
```

## Multiple Root Layouts:

> Route Groups can also create **multiple root layouts** (each with their own `<html>` and `<body>`).

```
app/
├── (marketing)/
│   ├── layout.js    ← Has <html> and <body>
│   └── page.js      → /
└── (shop)/
    ├── layout.js    ← Has <html> and <body>
    └── store/
        └── page.js  → /store
```

> ⚠️ When using multiple root layouts, the **root `app/layout.js` is removed**, and each group has its own.

## Use Cases Summary:

```
Route Groups are useful for:

1. Different layouts for different sections
   (auth pages vs dashboard pages)

2. Organizing code without affecting URLs

3. Splitting into multiple root layouts

4. Grouping related routes together
   (marketing pages, app pages, admin pages)
```

---

# 🔒 VIDEO 15: Private Folders in Next.js (S2 Ep.10)

## What are Private Folders?

> **Private Folders** are created by prefixing a folder name with an **underscore** `_folderName`. They are **excluded from routing** entirely.

```
_folderName  →  Next.js ignores this for routing purposes
```

## Why Use Private Folders?

```
Purpose:
✅ Separate UI logic from routing logic
✅ Store helper functions, utilities
✅ Organize internal components
✅ Avoid naming conflicts with Next.js special files
✅ Store test files close to components
```

## Structure Example:

```
app/
├── _components/          ← Private (not a route)
│   ├── Button.jsx
│   ├── Card.jsx
│   └── Modal.jsx
├── _lib/                 ← Private (not a route)
│   ├── utils.js
│   ├── helpers.js
│   └── constants.js
├── _hooks/               ← Private (not a route)
│   ├── useAuth.js
│   └── useFetch.js
├── page.js               → / (public route)
└── about/
    └── page.js           → /about (public route)
```

## Private vs Route Group:

| Feature          | `_folder` (Private)        | `(folder)` (Route Group) |
| ---------------- | -------------------------- | ------------------------ |
| Affects routing  | ❌ Excluded                | ❌ Excluded              |
| Can have layouts | ❌ No                      | ✅ Yes                   |
| Purpose          | Store utilities/components | Organize routes          |
| URL impact       | None                       | None                     |

## Example Usage:

```jsx
// app/_lib/utils.js
export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
```

```jsx
// app/_components/ProductCard.jsx
import { formatPrice } from "../_lib/utils";

export default function ProductCard({ product }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <img
        src={product.image}
        alt={product.title}
        style={{ width: "100%", height: "200px", objectFit: "contain" }}
      />
      <h3>{product.title}</h3>
      <p>{formatPrice(product.price)}</p>
      <button>Add to Cart</button>
    </div>
  );
}
```

```jsx
// app/products/page.js — Using private folder components
import ProductCard from "../_components/ProductCard";

export default async function ProductsPage() {
  const res = await fetch("https://fakestoreapi.com/products");
  const products = await res.json();

  return (
    <div>
      <h1>Products</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

## Recommended Project Structure:

```
my-next-app/
├── app/
│   ├── _components/           ← Shared components
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Modal.jsx
│   │   └── layout/
│   │       ├── Header.jsx
│   │       ├── Footer.jsx
│   │       └── Sidebar.jsx
│   ├── _lib/                  ← Utilities & helpers
│   │   ├── utils.js
│   │   ├── api.js
│   │   └── constants.js
│   ├── _hooks/                ← Custom hooks
│   │   ├── useLocalStorage.js
│   │   └── useDebounce.js
│   ├── (auth)/
│   │   ├── login/page.js
│   │   └── register/page.js
│   ├── (dashboard)/
│   │   ├── layout.js
│   │   └── dashboard/page.js
│   ├── layout.js
│   └── page.js
└── public/
```

---

# 🎨 VIDEO 16: Rendering Paradigms in Next.js (S3 Ep.1)

## The Big Picture of Rendering

> **Rendering** = Converting your React code into HTML that users see.

## All Rendering Types Explained:

### 1. Client-Side Rendering (CSR)

```
HOW IT WORKS:
─────────────
Browser → Server: "Give me the page"
Server → Browser: Empty HTML + JavaScript bundle
Browser: Downloads & executes JavaScript
Browser: React renders the UI
User: Finally sees content

TIMELINE: [Request]──[Empty HTML]──[Download JS]──[Execute]──[See content]
```

```jsx
// Pure CSR in Next.js — must be client component
"use client";
import { useState, useEffect } from "react";

export default function CSRComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Runs only in browser
    fetch("/api/data")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;
  return <div>{data.title}</div>;
}
```

**When to use CSR:**

- Highly interactive components
- User-specific data (after login)
- Real-time updates

### 2. Server-Side Rendering (SSR)

```
HOW IT WORKS:
─────────────
Browser → Server: "Give me the page"
Server: Fetches data, renders HTML
Server → Browser: Complete HTML (with content)
Browser: Displays content immediately
Browser: Downloads JS (hydration)
User: Page becomes interactive

TIMELINE: [Request]──[Server renders]──[Complete HTML]──[Hydration]──[Interactive]
```

```jsx
// SSR in Next.js — Server Component with no-store cache
async function SSRComponent() {
  // Fetches on EVERY request (like SSR)
  const res = await fetch("https://api.example.com/data", {
    cache: "no-store", // ← This makes it SSR
  });
  const data = await res.json();

  return <div>{data.title}</div>;
}
```

**When to use SSR:**

- User-specific content
- Real-time data (stock prices, live scores)
- Content that changes frequently

### 3. Static Site Generation (SSG)

```
HOW IT WORKS:
─────────────
BUILD TIME: Next.js fetches data → Generates HTML files
DEPLOY: HTML files uploaded to CDN
Request → CDN serves pre-built HTML instantly
User: Sees content almost instantly (no server processing)

TIMELINE: [Build]──[Generate HTML]──[Deploy to CDN]
          Then: [Request]──[CDN serves HTML]──[User sees content]
```

```jsx
// SSG in Next.js — Server Component with force-cache (default)
async function SSGComponent() {
  // Fetches at BUILD TIME only
  const res = await fetch("https://api.example.com/data", {
    cache: "force-cache", // ← This is the DEFAULT
  });
  const data = await res.json();

  return <div>{data.title}</div>;
}
```

**When to use SSG:**

- Blog posts
- Marketing pages
- Documentation
- Content that rarely changes

### 4. Incremental Static Regeneration (ISR)

```
HOW IT WORKS:
─────────────
Build time: Generate static pages
Deploy: Serve static pages
After set time (revalidate): Regenerate in background
Next request: Gets fresh content

Best of both worlds: Static performance + Fresh data
```

```jsx
// ISR in Next.js
async function ISRComponent() {
  const res = await fetch("https://api.example.com/data", {
    next: {
      revalidate: 60, // ← Regenerate every 60 seconds
    },
  });
  const data = await res.json();

  return <div>{data.title}</div>;
}
```

### Complete Comparison:

| Feature        | CSR             | SSR           | SSG            | ISR                |
| -------------- | --------------- | ------------- | -------------- | ------------------ |
| Renders where  | Browser         | Server        | Build time     | Build + Revalidate |
| SEO            | ❌ Poor         | ✅ Great      | ✅ Great       | ✅ Great           |
| Performance    | Slow initial    | Fast initial  | Fastest        | Fast               |
| Data freshness | Always fresh    | Always fresh  | Stale          | Configurable       |
| Server load    | Low             | High          | Very Low       | Low                |
| Best for       | Interactive UIs | Dynamic pages | Static content | Semi-dynamic       |

---

# ⚡ VIDEO 17: Static vs Dynamic Rendering in Next.js (S3 Ep.2)

## How Next.js Decides: Static or Dynamic?

> Next.js **automatically** determines whether to render statically or dynamically based on your code!

## Static Rendering (Default)

```
Next.js renders statically WHEN:
✅ No dynamic functions used
✅ No uncached data requests
✅ fetch() with cache: 'force-cache' (default)
✅ No cookies(), headers(), searchParams used
```

```jsx
// app/page.js — STATIC (rendered at build time)
async function StaticPage() {
  // Default fetch = force-cache = STATIC
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await res.json();

  return (
    <div>
      <h1>Posts (Static)</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}
```

## Dynamic Rendering (Triggered Automatically)

```
Next.js renders dynamically WHEN:
⚡ fetch() with cache: 'no-store'
⚡ cookies() function used
⚡ headers() function used
⚡ searchParams prop used
⚡ export const dynamic = 'force-dynamic'
```

```jsx
// app/page.js — DYNAMIC (rendered on every request)
import { cookies } from "next/headers";

async function DynamicPage() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme"); // ← Makes it DYNAMIC

  const res = await fetch("https://api.example.com/data", {
    cache: "no-store", // ← Also makes it dynamic
  });
  const data = await res.json();

  return (
    <div style={{ background: theme?.value === "dark" ? "#333" : "#fff" }}>
      <h1>Dynamic Page</h1>
      <p>{data.title}</p>
    </div>
  );
}
```

## Forcing Static or Dynamic:

```jsx
// Force static rendering
export const dynamic = "force-static";

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Auto (default — Next.js decides)
export const dynamic = "auto";

// Error if dynamic rendering needed
export const dynamic = "error";
```

## The `dynamic` Export Options:

```jsx
// app/dashboard/page.js
export const dynamic = "force-dynamic"; // Always render dynamically

export default async function DashboardPage() {
  const res = await fetch("https://api.example.com/user-data");
  const data = await res.json();

  return <div>{data.username}</div>;
}
```

## Checking if Page is Static or Dynamic:

```bash
# Run build and check output
npm run build

# Output shows:
# ○ = Static
# λ = Dynamic (Server-side rendered)
# ● = SSG (Static Site Generated)
```

## `searchParams` Makes Pages Dynamic:

```jsx
// app/search/page.js — DYNAMIC because of searchParams
export default function SearchPage({ searchParams }) {
  const query = searchParams.q; // ← Using searchParams = DYNAMIC

  return (
    <div>
      <h1>Search Results for: {query}</h1>
    </div>
  );
}

// URL: /search?q=nextjs
// searchParams = { q: 'nextjs' }
```

---

# 📸 VIDEO 18: Static Site Generation (SSG) in Next.js (S3 Ep.3)

## What is SSG?

> **Static Site Generation** pre-renders pages at **build time**. HTML is generated once and served to all users from a CDN.

## `generateStaticParams` Function

> Used with dynamic routes to tell Next.js **which paths to pre-generate** at build time.

```jsx
// app/products/[id]/page.js

// Tell Next.js which product IDs to pre-build
export async function generateStaticParams() {
  const res = await fetch("https://fakestoreapi.com/products");
  const products = await res.json();

  // Return array of param objects
  return products.map((product) => ({
    id: String(product.id), // Must be string
  }));
}

// This page will be pre-rendered for each ID
export default async function ProductPage({ params }) {
  const { id } = await params;

  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const product = await res.json();

  return (
    <div>
      <h1>{product.title}</h1>
      <p>Price: ${product.price}</p>
      <p>{product.description}</p>
    </div>
  );
}
```

## How `generateStaticParams` Works:

```
Build time:
1. Next.js calls generateStaticParams()
2. Gets: [{id: '1'}, {id: '2'}, {id: '3'}, ...]
3. For each param, fetches data and generates HTML
4. Stores: /products/1.html, /products/2.html, etc.

Request time:
5. User visits /products/1
6. CDN serves pre-built /products/1.html instantly!
```

## Nested Dynamic Routes with SSG:

```jsx
// app/[category]/[productId]/page.js

export async function generateStaticParams() {
  const categories = ["electronics", "clothing", "books"];
  const params = [];

  for (const category of categories) {
    const res = await fetch(
      `https://api.example.com/products?category=${category}`,
    );
    const products = await res.json();

    products.forEach((product) => {
      params.push({
        category: category,
        productId: String(product.id),
      });
    });
  }

  return params;
  // Returns: [
  //   { category: 'electronics', productId: '1' },
  //   { category: 'electronics', productId: '2' },
  //   { category: 'clothing', productId: '3' },
  // ]
}
```

## Blog Example with SSG:

```jsx
// app/blog/[slug]/page.js
const posts = [
  {
    slug: "intro-to-nextjs",
    title: "Intro to Next.js",
    content: "Content here...",
  },
  {
    slug: "react-hooks",
    title: "React Hooks Guide",
    content: "Content here...",
  },
  {
    slug: "typescript-tips",
    title: "TypeScript Tips",
    content: "Content here...",
  },
];

// Generate static params from local data
export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each post
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  return {
    title: post?.title ?? "Post Not Found",
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

---

# 🎛️ VIDEO 19: What is `dynamicParams` in Next.js (S3 Ep.4)

## The Problem

> When you use `generateStaticParams`, what happens if a user visits a path that was **NOT pre-generated**?

```
generateStaticParams returns: [{id: '1'}, {id: '2'}, {id: '3'}]
Pre-built pages: /products/1, /products/2, /products/3

User visits: /products/999  ← NOT pre-built!
What happens? → This is controlled by dynamicParams
```

## `dynamicParams` Options:

```jsx
// Option 1: true (DEFAULT)
export const dynamicParams = true;
// → Pages NOT in generateStaticParams are rendered DYNAMICALLY on demand
// → Generated pages are cached for future requests

// Option 2: false
export const dynamicParams = false;
// → Pages NOT in generateStaticParams return 404
```

## Example:

```jsx
// app/products/[id]/page.js

export const dynamicParams = true; // Default — allows new params

export async function generateStaticParams() {
  // Only pre-build products 1-5
  return [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }];
}

export default async function ProductPage({ params }) {
  const { id } = await params;

  const res = await fetch(`https://fakestoreapi.com/products/${id}`);

  if (!res.ok) {
    notFound();
  }

  const product = await res.json();

  return (
    <div>
      <h1>{product.title}</h1>
      <p>Price: ${product.price}</p>
    </div>
  );
}
```

## Behavior with `dynamicParams = true`:

```
Pre-built: /products/1 → /products/5
                        ↓
User visits /products/10 (not pre-built):
→ Next.js renders it dynamically on first request
→ Caches the result
→ Future visits get cached version
```

## Behavior with `dynamicParams = false`:

```jsx
// app/products/[id]/page.js
export const dynamicParams = false; // Strict SSG

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

// User visits /products/999
// → Returns 404 automatically
// → notFound() is called automatically
```

## When to Use Which:

```
dynamicParams = true (default):
✅ E-commerce with many products
✅ Blog with growing content
✅ When you can't pre-build everything

dynamicParams = false:
✅ Documentation sites
✅ Fixed set of pages that shouldn't change
✅ When you want 404 for unknown paths
```

---

# 🔄 VIDEO 20: What is ISR? — Incremental Static Regeneration (S3 Ep.5)

## What is ISR?

> **Incremental Static Regeneration** allows you to update static pages **after** they've been built, without rebuilding the entire site. You get the speed of static + freshness of dynamic!

## The Problem ISR Solves:

```
SSG Problem:
Build time: Generate page with product price $100
1 hour later: Price changes to $85
User sees: STILL $100 (stale!) ❌

ISR Solution:
Build time: Generate page with $100
After revalidate time: Regenerate with $85
User sees: Fresh $85 ✅
```

## Implementing ISR:

### Method 1: `revalidate` in fetch

```jsx
// app/products/page.js
export default async function ProductsPage() {
  const res = await fetch("https://fakestoreapi.com/products", {
    next: {
      revalidate: 60, // ← Revalidate every 60 seconds
    },
  });
  const products = await res.json();

  return (
    <div>
      <h1>Products</h1>
      <p>Last updated: {new Date().toLocaleTimeString()}</p>
      {products.map((p) => (
        <div key={p.id}>
          <h2>{p.title}</h2>
          <p>${p.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Method 2: Route-level `revalidate`

```jsx
// app/news/page.js
// This applies to ALL fetches in this route
export const revalidate = 3600; // Revalidate entire page every hour

export default async function NewsPage() {
  const res = await fetch("https://api.example.com/news");
  const news = await res.json();

  return (
    <div>
      <h1>Latest News</h1>
      {news.map((item) => (
        <article key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.summary}</p>
        </article>
      ))}
    </div>
  );
}
```

## How ISR Works Step by Step:

```
Step 1: Build time
→ Page generated: /news (with data from build)
→ Cached and served

Step 2: User visits /news (within revalidate period)
→ Served from cache instantly ⚡

Step 3: revalidate time passes (e.g., 60 seconds)
→ Cache marked as STALE

Step 4: Next user visits /news
→ Served stale content (still fast!)
→ Background: Next.js regenerates the page

Step 5: Following user visits /news
→ Gets FRESH content ✅
```

## `revalidate = 0` means no caching:

```jsx
// Equivalent to SSR (dynamic rendering)
export const revalidate = 0;

// OR
fetch(url, { cache: "no-store" });
```

## On-Demand Revalidation:

> Revalidate specific pages **instantly** when content changes (e.g., when CMS updates).

```jsx
// app/api/revalidate/route.js
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { path, secret } = await request.json();

  // Verify secret token
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  // Revalidate specific path
  revalidatePath(path);
  // OR revalidate by tag
  // revalidateTag('products');

  return NextResponse.json({ revalidated: true, path });
}
```

### Using `revalidateTag`:

```jsx
// app/products/page.js
export default async function ProductsPage() {
  const res = await fetch("https://api.example.com/products", {
    next: {
      tags: ["products"], // ← Tag this fetch
      revalidate: 3600,
    },
  });
  const products = await res.json();

  return <div>{/* render products */}</div>;
}
```

```jsx
// app/api/revalidate/route.js
import { revalidateTag } from "next/cache";

export async function POST() {
  revalidateTag("products"); // ← Revalidate all fetches tagged 'products'
  return Response.json({ revalidated: true });
}
```

## ISR vs Other Methods:

```
revalidate: undefined    → No revalidation (forever cached = SSG)
revalidate: 0           → No cache (SSR — every request)
revalidate: 60          → ISR — revalidate every 60 seconds
revalidate: 3600        → ISR — revalidate every hour
```

---

# 📝 SET 2 — Quick Revision Cheatsheet

```
┌──────────────────────────────────────────────────────────────┐
│                    NEXT.JS SET 2 SUMMARY                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  LAYOUTS:                                                    │
│  app/layout.js        → Root layout (required)               │
│  app/dash/layout.js   → Nested layout                        │
│  Layout persists across navigations!                         │
│                                                              │
│  METADATA:                                                   │
│  export const metadata = { title, description }              │
│  export async function generateMetadata({ params }) {}       │
│  title.template: '%s | My App'                               │
│                                                              │
│  NOT FOUND:                                                  │
│  app/not-found.js     → Global 404                           │
│  import { notFound } from 'next/navigation'                  │
│  notFound()           → Triggers 404                         │
│                                                              │
│  ROUTE GROUPS:                                               │
│  (auth)/login/page.js → URL: /login (no auth in URL)         │
│  Different layouts per section!                              │
│                                                              │
│  PRIVATE FOLDERS:                                            │
│  _components/         → Not a route                          │
│  _lib/                → Utilities                            │
│                                                              │
│  RENDERING:                                                  │
│  CSR  → 'use client' + useEffect                             │
│  SSR  → cache: 'no-store'                                    │
│  SSG  → cache: 'force-cache' (default)                       │
│  ISR  → next: { revalidate: 60 }                             │
│                                                              │
│  SSG:                                                        │
│  generateStaticParams() → Returns [{id:'1'},{id:'2'}]        │
│  dynamicParams = true/false                                  │
│                                                              │
│  ISR:                                                        │
│  fetch(url, { next: { revalidate: 60 }})                     │
│  export const revalidate = 3600                              │
│  revalidatePath('/path') → On-demand revalidation            │
│  revalidateTag('tag')   → Tag-based revalidation             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```
