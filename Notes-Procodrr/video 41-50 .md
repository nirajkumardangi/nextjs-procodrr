# 📚 Complete Next.js Course Notes — SET 5

### Videos 41–50 | By Anurag Singh (ProCodrr)

---

# 🎨 VIDEO 41: Setting Up Tailwind v4 in Next.js (S6 Ep.4)

## What is Tailwind CSS v4?

> **Tailwind CSS** is a utility-first CSS framework where you build designs by combining small, single-purpose utility classes directly in your HTML/JSX.

```
Traditional CSS:
.button {
  padding: 8px 16px;
  background: blue;
  color: white;
  border-radius: 4px;
}

Tailwind CSS:
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  Click me
</button>
```

## Tailwind v4 Key Changes from v3:

```
Tailwind v4 Improvements:
✅ No more tailwind.config.js needed (optional)
✅ CSS-first configuration
✅ Faster build times (Rust-based engine)
✅ Native CSS variables
✅ Better performance
✅ Simpler setup
```

## Fresh Next.js Setup with Tailwind v4:

```bash
# Create new Next.js app
npx create-next-app@latest my-app

# During setup, select YES for Tailwind CSS
# This installs Tailwind v4 automatically
```

## Manual Installation of Tailwind v4:

```bash
# Install Tailwind v4 and PostCSS
npm install tailwindcss @tailwindcss/postcss postcss
```

```js
// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

```css
/* app/globals.css */
/* Tailwind v4 — single import replaces all directives */
@import "tailwindcss";
```

## Tailwind v4 CSS Configuration:

```css
/* app/globals.css */
@import "tailwindcss";

/* Customize theme using CSS */
@theme {
  /* Custom colors */
  --color-primary: #3182ce;
  --color-secondary: #805ad5;
  --color-accent: #ed8936;

  /* Custom fonts */
  --font-sans: "Inter", sans-serif;
  --font-mono: "Fira Code", monospace;

  /* Custom spacing */
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;

  /* Custom breakpoints */
  --breakpoint-xs: 475px;

  /* Custom border radius */
  --radius-xl: 1rem;
}
```

## Using Tailwind Classes in Next.js:

```jsx
// app/page.js
export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-r from-blue-600 to-purple-600
                          text-white py-20 px-4 text-center"
      >
        <h1 className="text-5xl font-bold mb-4">Welcome to Next.js</h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
          Build amazing full-stack apps
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            className="bg-white text-blue-600 px-8 py-3
                             rounded-lg font-semibold hover:bg-blue-50
                             transition-colors"
          >
            Get Started
          </button>
          <button
            className="border-2 border-white text-white px-8 py-3
                             rounded-lg font-semibold hover:bg-white
                             hover:text-blue-600 transition-colors"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {["Fast", "Secure", "Scalable"].map((feature) => (
            <div
              key={feature}
              className="bg-white rounded-xl p-6 shadow-md
                         hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-3">{feature}</h3>
              <p className="text-gray-600">
                Description of {feature.toLowerCase()} feature.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
```

## Common Tailwind Utility Classes Reference:

```
LAYOUT:
container    → max-width container
flex         → display: flex
grid         → display: grid
hidden       → display: none
block        → display: block

SPACING:
p-4          → padding: 1rem
px-4         → padding left & right: 1rem
py-4         → padding top & bottom: 1rem
m-4          → margin: 1rem
mx-auto      → margin left & right: auto
gap-4        → gap: 1rem

SIZING:
w-full       → width: 100%
w-1/2        → width: 50%
h-screen     → height: 100vh
min-h-screen → min-height: 100vh
max-w-xl     → max-width: 36rem

COLORS:
bg-blue-500  → background-color: #3b82f6
text-white   → color: white
border-gray-200 → border-color

TYPOGRAPHY:
text-xl      → font-size: 1.25rem
text-3xl     → font-size: 1.875rem
font-bold    → font-weight: 700
font-semibold → font-weight: 600
text-center  → text-align: center
leading-6    → line-height: 1.5rem

BORDERS:
rounded      → border-radius: 0.25rem
rounded-lg   → border-radius: 0.5rem
rounded-full → border-radius: 9999px
border       → border-width: 1px
border-2     → border-width: 2px

EFFECTS:
shadow       → box-shadow: small
shadow-md    → box-shadow: medium
shadow-lg    → box-shadow: large
opacity-50   → opacity: 0.5

RESPONSIVE:
sm:text-lg   → @media (min-width: 640px)
md:grid-cols-3 → @media (min-width: 768px)
lg:flex      → @media (min-width: 1024px)

HOVER/FOCUS:
hover:bg-blue-600
focus:outline-none
focus:ring-2
active:scale-95

TRANSITIONS:
transition          → transition all
transition-colors   → transition color properties
duration-200        → transition-duration: 200ms
ease-in-out         → timing function
```

---

# ⚙️ VIDEO 42: Setting Up Tailwind v4 in Existing Next.js Project (S6 Ep.5)

## Migration from Tailwind v3 to v4:

### Step 1: Update Packages

```bash
# Remove old Tailwind
npm uninstall tailwindcss autoprefixer

# Install Tailwind v4
npm install tailwindcss @tailwindcss/postcss postcss
```

### Step 2: Update PostCSS Config

```js
// postcss.config.mjs (update from old config)
const config = {
  plugins: {
    // Remove: 'tailwindcss': {}
    // Remove: 'autoprefixer': {}
    // Add:
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### Step 3: Update CSS Import

```css
/* app/globals.css */

/* Remove these v3 directives: */
/* @tailwind base;        */
/* @tailwind components;  */
/* @tailwind utilities;   */

/* Add this single v4 import: */
@import "tailwindcss";
```

### Step 4: Migrate tailwind.config.js (if exists)

```css
/* Move config from tailwind.config.js to CSS */

/* OLD tailwind.config.js:
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: '#3182ce'
      }
    }
  }
}
*/

/* NEW — in globals.css: */
@import "tailwindcss";

@theme {
  --color-brand: #3182ce;
}
```

## Adding Tailwind to Existing Project from Scratch:

```bash
# In existing Next.js project
npm install tailwindcss @tailwindcss/postcss postcss
```

```js
// Create postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

```css
/* Add to top of app/globals.css */
@import "tailwindcss";

/* Your existing CSS below... */
```

## Dark Mode with Tailwind v4:

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-bg-light: #ffffff;
  --color-bg-dark: #1a202c;
  --color-text-light: #2d3748;
  --color-text-dark: #f7fafc;
}
```

```jsx
// Dark mode classes
export default function Card() {
  return (
    <div
      className="bg-white dark:bg-gray-800
                    text-gray-900 dark:text-white
                    p-6 rounded-xl shadow"
    >
      <h2 className="text-xl font-bold">Card Title</h2>
      <p className="text-gray-600 dark:text-gray-300">Card content here</p>
    </div>
  );
}
```

---

# 🖼️ VIDEO 43: Image Optimization in Next.js (S6 Ep.6)

## Why Image Optimization Matters

```
Problems with regular <img> tags:
❌ Large file sizes slow down pages
❌ No lazy loading by default
❌ No responsive sizing
❌ No format optimization (WebP, AVIF)
❌ Layout shift (no reserved space)
❌ No CDN optimization

Next.js <Image> component solves ALL of these!
```

## Basic `<Image>` Usage:

```jsx
// app/page.js
import Image from "next/image";

export default function Page() {
  return (
    <div>
      {/* Local image */}
      <Image
        src="/hero-image.jpg" // from /public folder
        alt="Hero image description" // Required for accessibility
        width={800} // Required for local images
        height={400} // Required for local images
        priority // Load eagerly (above fold)
      />

      {/* Remote image */}
      <Image
        src="https://example.com/photo.jpg"
        alt="Remote photo"
        width={600}
        height={400}
      />
    </div>
  );
}
```

## Configuring Remote Images:

```js
// next.config.js — Must whitelist remote domains
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
        port: "",
        pathname: "/img/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com", // Wildcard subdomain
      },
    ],
  },
};

export default nextConfig;
```

## `fill` Property for Responsive Images:

```jsx
import Image from "next/image";

// fill = image fills parent container
// Parent MUST have position: relative and defined dimensions

export default function HeroSection() {
  return (
    // Parent must have position:relative and height
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
      <Image
        src="/hero.jpg"
        alt="Hero"
        fill // Fills the parent
        style={{ objectFit: "cover" }} // Like background-size: cover
        priority // Load immediately (above fold)
      />
    </div>
  );
}
```

## `sizes` for Responsive Images:

```jsx
import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <div style={{ position: "relative", height: "300px" }}>
      <Image
        src={product.image}
        alt={product.title}
        fill
        style={{ objectFit: "contain" }}
        sizes="(max-width: 640px) 100vw,
               (max-width: 1024px) 50vw,
               33vw"
        // Tells browser: at mobile=full width, tablet=half, desktop=third
        // Next.js uses this to serve correctly sized images!
      />
    </div>
  );
}
```

## Image Quality and Formats:

```jsx
<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  quality={85} // Default is 75 (1-100)
  // Next.js auto-converts to WebP/AVIF for supported browsers!
/>
```

## Placeholder / Blur Effect:

```jsx
import Image from "next/image";
import heroImage from "/public/hero.jpg"; // Static import

export default function Hero() {
  return (
    <Image
      src={heroImage} // Static import enables blur
      alt="Hero image"
      placeholder="blur" // Shows blur while loading
      // blurDataURL auto-generated for static imports!
    />
  );
}
```

```jsx
// For remote images — provide blurDataURL manually
export default function RemoteImage() {
  return (
    <Image
      src="https://example.com/image.jpg"
      alt="Remote image"
      width={800}
      height={400}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQ..."
      // Generate base64 blur placeholder
    />
  );
}
```

## Complete Product Grid with Optimized Images:

```jsx
// app/products/page.js
import Image from "next/image";
import Link from "next/link";

export default async function ProductsPage() {
  const res = await fetch("https://fakestoreapi.com/products");
  const products = await res.json();

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="bg-white rounded-xl shadow hover:shadow-lg
                       transition-shadow overflow-hidden"
          >
            {/* Image container */}
            <div className="relative h-48 bg-gray-50">
              <Image
                src={product.image}
                alt={product.title}
                fill
                style={{ objectFit: "contain", padding: "16px" }}
                sizes="(max-width: 768px) 100vw,
                       (max-width: 1200px) 33vw,
                       25vw"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="font-semibold text-sm line-clamp-2 mb-2">
                {product.title}
              </h2>
              <p className="text-blue-600 font-bold">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

## Image Component Props Summary:

```
REQUIRED:
src       → Image path or URL
alt       → Alt text (accessibility)
width     → Width in pixels (not needed with fill)
height    → Height in pixels (not needed with fill)

OPTIONAL:
fill          → Fill parent container
priority      → Load eagerly (use for above-fold images)
quality       → Image quality 1-100 (default: 75)
placeholder   → 'blur' | 'empty' (default: 'empty')
blurDataURL   → Base64 blur placeholder for remote images
sizes         → Responsive size hints
style         → CSS styles
className     → CSS class
loading       → 'lazy' | 'eager' (default: 'lazy')
```

---

# 🖥️ VIDEO 44: Writing Backend Code in Next.js (S7 Ep.1)

## Next.js as Full-Stack Framework

```
Traditional Setup:
Frontend (React) ←→ Backend (Express/Node) ←→ Database

Next.js Full-Stack:
Frontend + Backend + Database
     ALL in ONE project! 🎉
```

## Route Handlers (API Routes)

> **Route Handlers** are the backend API endpoints in Next.js App Router. They replace the old `pages/api` directory.

```
app/
├── api/                  ← API routes live here
│   ├── users/
│   │   └── route.js      → /api/users
│   ├── products/
│   │   └── route.js      → /api/products
│   └── auth/
│       └── route.js      → /api/auth
└── page.js               → / (frontend page)
```

## Creating Your First Route Handler:

```js
// app/api/hello/route.js

// Named exports for HTTP methods
export async function GET(request) {
  return Response.json({
    message: "Hello from Next.js API!",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request) {
  const body = await request.json();

  return Response.json(
    {
      message: "Data received!",
      received: body,
    },
    { status: 201 },
  );
}
```

## HTTP Methods in Route Handlers:

```js
// app/api/todos/route.js

// GET — Retrieve data
export async function GET(request) {
  return Response.json({ todos: [] });
}

// POST — Create data
export async function POST(request) {
  return Response.json({ created: true }, { status: 201 });
}

// PUT — Update data (full update)
export async function PUT(request) {
  return Response.json({ updated: true });
}

// PATCH — Update data (partial update)
export async function PATCH(request) {
  return Response.json({ patched: true });
}

// DELETE — Delete data
export async function DELETE(request) {
  return Response.json({ deleted: true });
}
```

## NextResponse vs Response:

```js
import { NextResponse } from "next/server";

// Using Response (Web standard)
export async function GET() {
  return Response.json({ data: "hello" });
}

// Using NextResponse (Next.js specific — more features)
export async function GET() {
  return NextResponse.json(
    { data: "hello" },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "X-Custom-Header": "value",
      },
    },
  );
}
```

## In-Memory Todo Store (for learning):

```js
// app/api/todos/route.js

// Simple in-memory store (resets on server restart)
// In production, use a database!
let todos = [
  { id: 1, title: "Learn Next.js", completed: false },
  { id: 2, title: "Build a project", completed: false },
  { id: 3, title: "Deploy to Vercel", completed: false },
];

let nextId = 4;

export async function GET() {
  return Response.json({
    success: true,
    count: todos.length,
    todos,
  });
}

export async function POST(request) {
  const body = await request.json();

  // Validation
  if (!body.title || body.title.trim() === "") {
    return Response.json(
      { success: false, error: "Title is required" },
      { status: 400 },
    );
  }

  const newTodo = {
    id: nextId++,
    title: body.title.trim(),
    completed: body.completed || false,
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);

  return Response.json({ success: true, todo: newTodo }, { status: 201 });
}
```

---

# 📋 VIDEO 45: Creating GET Route Handler in Next.js (S7 Ep.2)

## GET Request Deep Dive

```js
// app/api/products/route.js
import { NextResponse } from "next/server";

const products = [
  { id: 1, name: "Laptop", price: 999, category: "electronics" },
  { id: 2, name: "Phone", price: 699, category: "electronics" },
  { id: 3, name: "T-Shirt", price: 29, category: "clothing" },
  { id: 4, name: "Book", price: 15, category: "books" },
];

export async function GET(request) {
  // Access URL and search params
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  let filtered = [...products];

  // Filter by category
  if (category) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  }

  // Filter by price range
  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice));
  }

  // Sort
  if (sort === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    data: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
}
```

## Setting Response Headers:

```js
// app/api/data/route.js
export async function GET() {
  const data = { value: "Hello World" };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      "Access-Control-Allow-Origin": "*", // CORS
      "X-Custom-Header": "my-value",
    },
  });
}
```

## CORS Configuration:

```js
// app/api/public/route.js
export async function GET() {
  return Response.json(
    { data: "Public data" },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  );
}

// Handle OPTIONS preflight request
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
```

---

# 🔀 VIDEO 46: Dynamic Route Handler in Next.js (S7 Ep.3)

## Dynamic API Routes

> Use `[id]` folder naming for dynamic API endpoints.

```
app/
└── api/
    └── todos/
        ├── route.js         → /api/todos
        └── [id]/
            └── route.js     → /api/todos/1, /api/todos/2
```

```js
// app/api/todos/[id]/route.js

let todos = [
  { id: 1, title: "Learn Next.js", completed: false },
  { id: 2, title: "Build project", completed: true },
];

// GET single todo
export async function GET(request, { params }) {
  const { id } = await params;
  const todoId = parseInt(id);

  const todo = todos.find((t) => t.id === todoId);

  if (!todo) {
    return Response.json(
      { success: false, error: `Todo with id ${id} not found` },
      { status: 404 },
    );
  }

  return Response.json({
    success: true,
    todo,
  });
}

// PUT — Full update
export async function PUT(request, { params }) {
  const { id } = await params;
  const todoId = parseInt(id);
  const body = await request.json();

  const index = todos.findIndex((t) => t.id === todoId);

  if (index === -1) {
    return Response.json(
      { success: false, error: "Todo not found" },
      { status: 404 },
    );
  }

  todos[index] = {
    ...todos[index],
    title: body.title || todos[index].title,
    completed: body.completed ?? todos[index].completed,
    updatedAt: new Date().toISOString(),
  };

  return Response.json({
    success: true,
    todo: todos[index],
  });
}

// DELETE
export async function DELETE(request, { params }) {
  const { id } = await params;
  const todoId = parseInt(id);

  const index = todos.findIndex((t) => t.id === todoId);

  if (index === -1) {
    return Response.json(
      { success: false, error: "Todo not found" },
      { status: 404 },
    );
  }

  const deleted = todos.splice(index, 1)[0];

  return Response.json({
    success: true,
    message: "Todo deleted successfully",
    todo: deleted,
  });
}
```

---

# 📬 VIDEO 47: Understanding Request Object in Next.js (S7 Ep.4)

## The Request Object

> Route Handlers receive a `NextRequest` object (extends Web `Request` API).

```js
// app/api/demo/route.js
import { NextRequest } from "next/server";

export async function GET(request) {
  // URL Information
  const url = request.url;
  const { pathname, searchParams, origin } = new URL(request.url);

  // Search params
  const query = searchParams.get("q");
  const page = searchParams.get("page");

  // Headers
  const contentType = request.headers.get("content-type");
  const authHeader = request.headers.get("authorization");
  const userAgent = request.headers.get("user-agent");

  // Method
  const method = request.method;

  // Cookies (NextRequest specific)
  const token = request.cookies.get("token");
  const allCookies = request.cookies.getAll();

  return Response.json({
    url,
    pathname,
    query,
    page,
    method,
    contentType,
    userAgent,
    hasCookie: !!token,
  });
}
```

## Reading Request Body:

```js
// app/api/users/route.js
export async function POST(request) {
  const contentType = request.headers.get("content-type");

  // JSON body
  if (contentType?.includes("application/json")) {
    const body = await request.json();
    console.log("JSON body:", body);
  }

  // Form data
  if (contentType?.includes("multipart/form-data")) {
    const formData = await request.formData();
    const name = formData.get("name");
    const file = formData.get("file");
    console.log("Form data:", { name, file });
  }

  // Plain text
  if (contentType?.includes("text/plain")) {
    const text = await request.text();
    console.log("Text body:", text);
  }

  return Response.json({ received: true });
}
```

## Accessing Cookies and Headers:

```js
// app/api/protected/route.js
import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export async function GET(request) {
  // Method 1: From request object (NextRequest)
  const tokenFromRequest = request.cookies.get("authToken")?.value;

  // Method 2: Using next/headers (Server-side)
  const cookieStore = await cookies();
  const tokenFromStore = cookieStore.get("authToken")?.value;

  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  if (!tokenFromRequest && !tokenFromStore) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    message: "Protected data",
    data: { value: "secret" },
  });
}
```

---

# 📝 VIDEO 48: Handling POST Request in Next.js (S7 Ep.5)

## Complete POST Handler with Validation:

```js
// app/api/todos/route.js
import { NextResponse } from "next/server";

let todos = [];
let nextId = 1;

// GET all todos
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const completed = searchParams.get("completed");

  let result = [...todos];

  if (completed !== null) {
    const isCompleted = completed === "true";
    result = result.filter((t) => t.completed === isCompleted);
  }

  return NextResponse.json({
    success: true,
    count: result.length,
    todos: result,
  });
}

// POST — Create todo
export async function POST(request) {
  try {
    const body = await request.json();

    // Validation
    const errors = [];

    if (!body.title) {
      errors.push("Title is required");
    } else if (body.title.trim().length < 3) {
      errors.push("Title must be at least 3 characters");
    } else if (body.title.trim().length > 100) {
      errors.push("Title must be less than 100 characters");
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 422 });
    }

    const newTodo = {
      id: nextId++,
      title: body.title.trim(),
      completed: Boolean(body.completed) || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todos.push(newTodo);

    return NextResponse.json({ success: true, todo: newTodo }, { status: 201 });
  } catch (error) {
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

---

# ✏️ VIDEO 49: Implementing Edit Todo Functionality (S7 Ep.6)

## PUT Route Handler (Full Update):

```js
// app/api/todos/[id]/route.js
import { NextResponse } from "next/server";

// Shared todos array (in real app, use database)
// This is imported from a shared module
import { todos, updateTodo, findTodo } from "@/lib/todosStore";

export async function GET(request, { params }) {
  const { id } = await params;
  const todo = findTodo(parseInt(id));

  if (!todo) {
    return NextResponse.json(
      { success: false, error: "Todo not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, todo });
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const todoId = parseInt(id);
    const body = await request.json();

    // Validate
    if (!body.title || body.title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 422 },
      );
    }

    const todo = findTodo(todoId);

    if (!todo) {
      return NextResponse.json(
        { success: false, error: "Todo not found" },
        { status: 404 },
      );
    }

    const updatedTodo = {
      ...todo,
      title: body.title.trim(),
      completed: body.completed ?? todo.completed,
      updatedAt: new Date().toISOString(),
    };

    updateTodo(todoId, updatedTodo);

    return NextResponse.json({
      success: true,
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH — Partial update
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const todoId = parseInt(id);
    const body = await request.json();

    const todo = findTodo(todoId);

    if (!todo) {
      return NextResponse.json(
        { success: false, error: "Todo not found" },
        { status: 404 },
      );
    }

    // Only update fields that are provided
    const updatedTodo = {
      ...todo,
      ...(body.title !== undefined && { title: body.title.trim() }),
      ...(body.completed !== undefined && { completed: body.completed }),
      updatedAt: new Date().toISOString(),
    };

    updateTodo(todoId, updatedTodo);

    return NextResponse.json({
      success: true,
      todo: updatedTodo,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

## Shared Todo Store Module:

```js
// lib/todosStore.js
// In-memory store — replace with database in production

let todos = [
  {
    id: 1,
    title: "Learn Next.js",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Build a Todo App",
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

let nextId = 3;

export function getAllTodos() {
  return [...todos];
}

export function findTodo(id) {
  return todos.find((t) => t.id === id) || null;
}

export function createTodo(data) {
  const todo = {
    id: nextId++,
    title: data.title,
    completed: data.completed || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  todos.push(todo);
  return todo;
}

export function updateTodo(id, data) {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return null;
  todos[index] = { ...todos[index], ...data };
  return todos[index];
}

export function deleteTodo(id) {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const [deleted] = todos.splice(index, 1);
  return deleted;
}
```

---

# 🗑️ VIDEO 50: Handling DELETE Request in Next.js (S7 Ep.7)

## DELETE Route Handler:

```js
// app/api/todos/[id]/route.js
import { NextResponse } from "next/server";
import { findTodo, deleteTodo } from "@/lib/todosStore";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const todoId = parseInt(id);

    // Validate ID is a number
    if (isNaN(todoId)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 },
      );
    }

    const todo = findTodo(todoId);

    if (!todo) {
      return NextResponse.json(
        { success: false, error: `Todo with id ${todoId} not found` },
        { status: 404 },
      );
    }

    const deleted = deleteTodo(todoId);

    return NextResponse.json({
      success: true,
      message: "Todo deleted successfully",
      deletedTodo: deleted,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

## HTTP Status Codes Reference:

```
2xx Success:
200 OK              → Successful GET, PUT, PATCH
201 Created         → Successful POST
204 No Content      → Successful DELETE (no body)

4xx Client Errors:
400 Bad Request     → Invalid request format
401 Unauthorized    → Not authenticated
403 Forbidden       → Authenticated but not authorized
404 Not Found       → Resource doesn't exist
405 Method Not Allowed → HTTP method not supported
409 Conflict        → Resource already exists
422 Unprocessable   → Validation errors

5xx Server Errors:
500 Internal Server Error → Unexpected server error
502 Bad Gateway           → Upstream server error
503 Service Unavailable   → Server temporarily down
```

## Complete API Structure So Far:

```
app/api/todos/
├── route.js           → GET all, POST new
└── [id]/
    └── route.js       → GET one, PUT, PATCH, DELETE

Endpoints:
GET    /api/todos          → Get all todos
POST   /api/todos          → Create new todo
GET    /api/todos/:id      → Get single todo
PUT    /api/todos/:id      → Full update todo
PATCH  /api/todos/:id      → Partial update todo
DELETE /api/todos/:id      → Delete todo

This is a complete RESTful API! ✅
```

---

# 📝 SET 5 — Quick Revision Cheatsheet

```
┌──────────────────────────────────────────────────────────────┐
│                    NEXT.JS SET 5 SUMMARY                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  TAILWIND v4 SETUP:                                          │
│  npm install tailwindcss @tailwindcss/postcss postcss        │
│  postcss.config.mjs → '@tailwindcss/postcss': {}             │
│  globals.css → @import "tailwindcss"                         │
│  Config via @theme { } in CSS (no tailwind.config.js)        │
│                                                              │
│  IMAGE OPTIMIZATION:                                         │
│  import Image from 'next/image'                              │
│  Required: src, alt, width, height (or fill)                 │
│  Remote images need: next.config.js remotePatterns           │
│  fill → fills parent (parent needs position:relative)        │
│  priority → for above-fold images                            │
│  placeholder="blur" → blur while loading                     │
│                                                              │
│  ROUTE HANDLERS (API Routes):                                │
│  app/api/todos/route.js → /api/todos                         │
│  app/api/todos/[id]/route.js → /api/todos/:id                │
│  Named exports: GET, POST, PUT, PATCH, DELETE                │
│  Response.json({}) or NextResponse.json({})                  │
│                                                              │
│  REQUEST OBJECT:                                             │
│  request.url → full URL                                      │
│  new URL(request.url).searchParams → query params            │
│  request.json() → parse JSON body                            │
│  request.headers.get('key') → get header                     │
│  request.cookies.get('name') → get cookie                    │
│                                                              │
│  HTTP STATUS CODES:                                          │
│  200 OK, 201 Created, 204 No Content                         │
│  400 Bad Request, 401 Unauthorized, 404 Not Found            │
│  422 Validation Error, 500 Server Error                      │
│                                                              │
│  DYNAMIC ROUTE HANDLER:                                      │
│  export async function GET(request, { params }) {            │
│    const { id } = await params;                              │
│  }                                                           │
│                                                              │
│  REST API PATTERN:                                           │
│  GET    /api/resource     → Get all                          │
│  POST   /api/resource     → Create                           │
│  GET    /api/resource/:id → Get one                          │
│  PUT    /api/resource/:id → Full update                      │
│  PATCH  /api/resource/:id → Partial update                   │
│  DELETE /api/resource/:id → Delete                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```
