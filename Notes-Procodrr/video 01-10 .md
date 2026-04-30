# 📚 Complete Next.js Course Notes — SET 1

### Videos 1–10 | By Anurag Singh (ProCodrr)

---

# 🎯 VIDEO 1: Next.js Full-Stack Course Launch

## What is this course about?

This is a **complete full-stack Next.js 15 course** covering:

- Frontend (React-based UI with Next.js)
- Backend (API Routes, Route Handlers)
- Database (MongoDB)
- Authentication (Custom + Auth.js)
- Deployment (Vercel)
- Advanced features (Middleware, Server Actions, i18n)

## Why Next.js?

- Next.js is built **on top of React**
- It adds **full-stack capabilities** to React
- Used by major companies: Netflix, TikTok, Twitch, GitHub, etc.
- Maintained by **Vercel**

---

# 🗺️ VIDEO 2: Course Overview & Curriculum Walkthrough

## Course Structure (Seasons):

| Season | Topic                                    |
| ------ | ---------------------------------------- |
| S1     | Introduction & Setup                     |
| S2     | Routing System                           |
| S3     | Rendering Paradigms                      |
| S4     | Data Fetching                            |
| S5     | Error Handling                           |
| S6     | Styling                                  |
| S7     | Backend / API Routes                     |
| S8     | MongoDB Integration                      |
| S9     | Authentication                           |
| S10    | Deployment                               |
| S11    | Server Actions                           |
| S12    | Advanced Features                        |
| S13    | Industry Setup (ESLint, Prettier, Husky) |

## Key Takeaways:

- You'll build a **full-stack Todo App** throughout the course
- Learn both **theory** and **practical implementation**
- Course covers **Next.js 15** (latest version)

---

# 📖 VIDEO 3: Introduction to Next.js (S1 E1)

## What is Next.js?

> Next.js is a **React framework** that enables you to build full-stack web applications by extending React's capabilities with powerful features like server-side rendering, static site generation, file-based routing, and more.

### Key Points:

- Next.js is **not a replacement** for React — it's built **on top of React**
- React is a **UI library**; Next.js is a **framework**
- Next.js handles things React doesn't: routing, SSR, SSG, API routes, etc.

## Problems with Plain React (Create React App):

| Problem                 | Explanation                      |
| ----------------------- | -------------------------------- |
| No built-in routing     | Need React Router                |
| No SSR out of the box   | Everything is client-side        |
| SEO issues              | Search engines struggle with CSR |
| No backend capabilities | Need a separate server           |
| Slow initial load       | Large JS bundle                  |

## What Next.js Solves:

```
Plain React                    Next.js
─────────────────────────────────────────
Client-side only       →       SSR + SSG + CSR
Manual routing         →       File-based routing
No SEO                 →       SEO friendly
No backend             →       API Routes built-in
Slow first load        →       Optimized performance
```

## Next.js Core Features:

1. **File-based Routing** — No need for react-router
2. **Server-Side Rendering (SSR)** — Pages rendered on server
3. **Static Site Generation (SSG)** — Pre-built HTML files
4. **API Routes** — Write backend code within Next.js
5. **Image Optimization** — Built-in `<Image>` component
6. **Font Optimization** — Auto-optimized fonts
7. **Middleware** — Run code before requests complete

## App Router vs Pages Router:

```
Next.js has TWO routing systems:

1. Pages Router (Old — Next.js 12 and below)
   → /pages directory
   → Still supported

2. App Router (New — Next.js 13+)
   → /app directory
   → Recommended for new projects
   → Supports React Server Components
```

---

# 🛠️ VIDEO 4: Creating Our First Next.js App (S1 E2)

## Installation

### Prerequisites:

- Node.js installed (v18.17 or later)
- npm / yarn / pnpm

### Create a New Next.js App:

```bash
npx create-next-app@latest my-next-app
```

### Interactive Setup Prompts:

```
✔ Would you like to use TypeScript? → Yes/No
✔ Would you like to use ESLint? → Yes
✔ Would you like to use Tailwind CSS? → Yes/No
✔ Would you like to use `src/` directory? → Yes/No
✔ Would you like to use App Router? → Yes (recommended)
✔ Would you like to customize the default import alias? → No
```

### Project Structure Created:

```
my-next-app/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js        ← Root Layout
│   └── page.js          ← Home Page (/)
├── public/
│   └── (static files)
├── .eslintrc.json
├── next.config.js
├── package.json
└── README.md
```

## Running the Development Server:

```bash
cd my-next-app
npm run dev
```

App runs at: **http://localhost:3000**

## Important Scripts in package.json:

```json
{
  "scripts": {
    "dev": "next dev", // Development mode
    "build": "next build", // Production build
    "start": "next start", // Start production server
    "lint": "next lint" // Run ESLint
  }
}
```

## Understanding `app/page.js`:

```jsx
// app/page.js — This is your HOME page
// Accessible at: http://localhost:3000/

export default function Home() {
  return (
    <main>
      <h1>Welcome to Next.js!</h1>
    </main>
  );
}
```

## Understanding `app/layout.js`:

```jsx
// app/layout.js — Root Layout
// Wraps ALL pages

export const metadata = {
  title: "My Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

> 💡 **Key Concept**: `layout.js` persists across page navigations. It does NOT re-render when you navigate between pages.

---

# ⚡ VIDEO 5: Real Difference Between React.js and Next.js (S1 E3)

## Rendering Methods — Core Concept

### 1. Client-Side Rendering (CSR) — How React Works

```
Browser Request → Server sends empty HTML + JS bundle
→ Browser downloads JS → JS executes → Page renders

Timeline:
[Request] ──→ [Empty HTML] ──→ [Download JS] ──→ [Render Page]
```

**HTML sent from server:**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <!-- Empty! JS fills this -->
    <script src="/bundle.js"></script>
  </body>
</html>
```

**Problems with CSR:**

- ❌ Bad SEO (bots see empty page)
- ❌ Slow First Contentful Paint (FCP)
- ❌ White screen flash on load

### 2. Server-Side Rendering (SSR) — Next.js Capability

```
Browser Request → Server fetches data → Server renders HTML
→ Sends complete HTML to browser → Browser displays immediately

Timeline:
[Request] ──→ [Server renders] ──→ [Complete HTML sent] ──→ [Display]
```

**HTML sent from server:**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Next.js App</title>
  </head>
  <body>
    <div id="root">
      <h1>My Products</h1>
      <!-- Already rendered! -->
      <p>Product 1</p>
      <p>Product 2</p>
    </div>
  </body>
</html>
```

**Benefits of SSR:**

- ✅ Great SEO
- ✅ Fast First Contentful Paint
- ✅ Content visible before JS loads

### 3. Static Site Generation (SSG)

```
Build Time → HTML pre-generated → Stored on CDN
→ Request → CDN serves static HTML → Lightning fast!
```

### Comparison Table:

| Feature       | React (CSR) | Next.js SSR          | Next.js SSG         |
| ------------- | ----------- | -------------------- | ------------------- |
| When rendered | Browser     | Server (per request) | Build time          |
| SEO           | ❌ Poor     | ✅ Great             | ✅ Great            |
| First load    | Slow        | Fast                 | Fastest             |
| Dynamic data  | ✅ Yes      | ✅ Yes               | ❌ No (without ISR) |
| Server load   | Low         | High                 | Very Low            |

## React vs Next.js Side by Side

### Routing:

**React (needs react-router-dom):**

```jsx
// React — Manual routing setup
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products/:id" element={<Product />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Next.js (automatic file-based routing):**

```
app/
├── page.js          → /
├── about/
│   └── page.js      → /about
└── products/
    └── [id]/
        └── page.js  → /products/:id

No configuration needed!
```

### Data Fetching:

**React (CSR approach):**

```jsx
// React component — data fetched in browser
import { useState, useEffect } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This runs IN THE BROWSER
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

**Next.js (Server Component — data fetched on server):**

```jsx
// Next.js Server Component — data fetched on SERVER
// No useState, no useEffect needed!

async function Products() {
  // This runs ON THE SERVER
  const res = await fetch("https://api.example.com/products");
  const products = await res.json();

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}

export default Products;
```

### SEO Comparison:

**React SEO Issue:**

```
Google Bot crawls → Sees: <div id="root"></div>
→ No content to index ❌
```

**Next.js SEO Benefit:**

```
Google Bot crawls → Sees full HTML content
→ Indexes everything ✅
```

## Server Components vs Client Components (Intro)

```
Next.js App Router introduces:

Server Components (DEFAULT):
- Run on the server
- Can fetch data directly
- Cannot use useState, useEffect
- Cannot use browser APIs
- Smaller JS bundle (code stays on server)

Client Components (opt-in with 'use client'):
- Run in the browser
- Can use useState, useEffect
- Can handle user interactions
- Can use browser APIs
```

```jsx
// Server Component (default - no directive needed)
async function ServerComponent() {
  const data = await fetch("https://api.example.com/data");
  const json = await data.json();
  return <div>{json.title}</div>;
}

// Client Component (needs 'use client' at top)
("use client");
import { useState } from "react";

function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

---

# 🗂️ VIDEO 6: Routing in Next.js (S2 Ep.1)

## File-Based Routing System

> In Next.js App Router, **folders define routes** and `page.js` files make them accessible.

### Core Rules:

1. Every route needs a **folder** with the route name
2. Inside that folder, create a `page.js` file
3. The `page.js` exports a React component

### Basic Routing Structure:

```
app/
├── page.js              → http://localhost:3000/
├── about/
│   └── page.js          → http://localhost:3000/about
├── contact/
│   └── page.js          → http://localhost:3000/contact
└── blog/
    └── page.js          → http://localhost:3000/blog
```

### Creating Pages:

```jsx
// app/page.js — Home page
export default function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to my website!</p>
    </div>
  );
}
```

```jsx
// app/about/page.js — About page
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page.</p>
    </div>
  );
}
```

```jsx
// app/contact/page.js — Contact page
export default function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Reach us at: contact@example.com</p>
    </div>
  );
}
```

## Navigation with `<Link>` Component

> Never use `<a>` tags for internal navigation in Next.js!

```jsx
// app/page.js
import Link from "next/link";

export default function HomePage() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
      <Link href="/blog">Blog</Link>
    </nav>
  );
}
```

### `<Link>` vs `<a>`:

| Feature          | `<a>` tag | `<Link>` component |
| ---------------- | --------- | ------------------ |
| Full page reload | ✅ Yes    | ❌ No              |
| Client-side nav  | ❌ No     | ✅ Yes             |
| Prefetching      | ❌ No     | ✅ Yes (auto)      |
| Fast navigation  | ❌ No     | ✅ Yes             |

## Special Files in Next.js App Router:

```
app/
├── page.js        ← UI for the route (REQUIRED for page)
├── layout.js      ← Shared layout (wraps children)
├── loading.js     ← Loading UI
├── error.js       ← Error UI
├── not-found.js   ← 404 page
└── route.js       ← API endpoint (Route Handler)
```

## `useRouter` for Programmatic Navigation:

```jsx
"use client";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();

  function handleLogin() {
    // ... do login
    router.push("/dashboard"); // Navigate to dashboard
    // router.replace('/dashboard'); // Navigate without history
    // router.back();               // Go back
    // router.forward();            // Go forward
    // router.refresh();            // Refresh current page
  }

  return <button onClick={handleLogin}>Login</button>;
}
```

---

# 📁 VIDEO 7: Nested Routing in Next.js (S2 Ep.2)

## What is Nested Routing?

> Nested routing means having routes inside routes, creating a hierarchy like `/blog/post/comments`.

### Creating Nested Routes:

```
app/
├── page.js                        → /
└── blog/
    ├── page.js                    → /blog
    └── post/
        ├── page.js                → /blog/post
        └── comments/
            └── page.js           → /blog/post/comments
```

### Example Implementation:

```jsx
// app/blog/page.js
import Link from "next/link";

export default function BlogPage() {
  return (
    <div>
      <h1>Blog</h1>
      <Link href="/blog/post">Read Our Latest Post</Link>
    </div>
  );
}
```

```jsx
// app/blog/post/page.js
import Link from "next/link";

export default function PostPage() {
  return (
    <div>
      <h1>Blog Post</h1>
      <p>This is a blog post content...</p>
      <Link href="/blog/post/comments">View Comments</Link>
    </div>
  );
}
```

```jsx
// app/blog/post/comments/page.js
export default function CommentsPage() {
  return (
    <div>
      <h1>Comments</h1>
      <p>Comment 1: Great post!</p>
      <p>Comment 2: Very informative!</p>
    </div>
  );
}
```

## Nested Layouts:

> Each folder can have its own `layout.js` that wraps its children!

```
app/
├── layout.js          ← Root layout (wraps everything)
└── dashboard/
    ├── layout.js      ← Dashboard layout (wraps dashboard pages)
    ├── page.js        → /dashboard
    └── settings/
        └── page.js    → /dashboard/settings
```

```jsx
// app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <div>
      <aside>
        <nav>
          <a href="/dashboard">Overview</a>
          <a href="/dashboard/settings">Settings</a>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
```

### Layout Nesting Diagram:

```
RootLayout (app/layout.js)
└── DashboardLayout (app/dashboard/layout.js)
    └── page content (app/dashboard/page.js)
```

---

# 🔀 VIDEO 8: Dynamic Routing in Next.js (S2 Ep.3)

## What is Dynamic Routing?

> Dynamic routes are routes where a **segment of the URL is variable** — like `/products/1`, `/products/2`, `/users/john`, etc.

### Creating Dynamic Routes:

> Wrap the folder name in **square brackets**: `[paramName]`

```
app/
├── page.js
└── products/
    ├── page.js              → /products
    └── [id]/
        └── page.js          → /products/1, /products/2, etc.
```

### Accessing the Dynamic Parameter:

```jsx
// app/products/[id]/page.js

export default function ProductPage({ params }) {
  // params.id contains the dynamic value
  const { id } = params;

  return (
    <div>
      <h1>Product ID: {id}</h1>
    </div>
  );
}
```

> ⚠️ **Next.js 15 Update**: `params` is now a **Promise** and must be awaited!

```jsx
// app/products/[id]/page.js — Next.js 15
export default async function ProductPage({ params }) {
  const { id } = await params; // Must await in Next.js 15

  return (
    <div>
      <h1>Product ID: {id}</h1>
    </div>
  );
}
```

### Real-World Example with Data Fetching:

```jsx
// app/products/[id]/page.js
export default async function ProductPage({ params }) {
  const { id } = await params;

  // Fetch specific product using the dynamic id
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  const product = await res.json();

  return (
    <div>
      <h1>{product.title}</h1>
      <p>Price: ${product.price}</p>
      <p>{product.description}</p>
      <img src={product.image} alt={product.title} width={200} />
    </div>
  );
}
```

### Multiple Dynamic Segments:

```
app/
└── shop/
    └── [category]/
        └── [productId]/
            └── page.js   → /shop/electronics/123
```

```jsx
// app/shop/[category]/[productId]/page.js
export default async function ShopPage({ params }) {
  const { category, productId } = await params;

  return (
    <div>
      <h1>Category: {category}</h1>
      <h2>Product ID: {productId}</h2>
    </div>
  );
}
```

### Linking to Dynamic Routes:

```jsx
// app/products/page.js
import Link from "next/link";

const products = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Phone" },
  { id: 3, name: "Tablet" },
];

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link href={`/products/${product.id}`}>{product.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

# 🔗 VIDEO 9: Nested Dynamic Routing in Next.js (S2 Ep.4)

## Combining Nested + Dynamic Routes

### Structure:

```
app/
└── users/
    └── [userId]/
        ├── page.js              → /users/1
        └── posts/
            └── [postId]/
                └── page.js      → /users/1/posts/5
```

### Implementation:

```jsx
// app/users/[userId]/page.js
export default async function UserPage({ params }) {
  const { userId } = await params;

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
  );
  const user = await res.json();

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <a href={`/users/${userId}/posts`}>View Posts</a>
    </div>
  );
}
```

```jsx
// app/users/[userId]/posts/[postId]/page.js
export default async function UserPostPage({ params }) {
  const { userId, postId } = await params;

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
  );
  const post = await res.json();

  return (
    <div>
      <h1>{post.title}</h1>
      <p>By User: {userId}</p>
      <p>{post.body}</p>
    </div>
  );
}
```

## `useParams` Hook for Client Components:

```jsx
"use client";
import { useParams } from "next/navigation";

export default function ClientUserPage() {
  const params = useParams();
  // params = { userId: '1', postId: '5' }

  return (
    <div>
      <p>User: {params.userId}</p>
      <p>Post: {params.postId}</p>
    </div>
  );
}
```

## Breadcrumb Navigation Example:

```jsx
// app/users/[userId]/posts/[postId]/page.js
import Link from "next/link";

export default async function PostDetailPage({ params }) {
  const { userId, postId } = await params;

  return (
    <div>
      {/* Breadcrumb */}
      <nav>
        <Link href="/">Home</Link>
        {" > "}
        <Link href="/users">Users</Link>
        {" > "}
        <Link href={`/users/${userId}`}>User {userId}</Link>
        {" > "}
        <span>Post {postId}</span>
      </nav>

      <h1>
        Post {postId} by User {userId}
      </h1>
    </div>
  );
}
```

---

# 🕸️ VIDEO 10: Catch All Routes in Next.js (S2 Ep.5)

## What are Catch-All Routes?

> Catch-all routes match **any number of URL segments** at once.

### Two Types:

```
[...slug]     → Catch-all        (Required — won't match /)
[[...slug]]   → Optional catch-all (Matches / too)
```

### Creating Catch-All Routes:

```
app/
└── docs/
    └── [...slug]/
        └── page.js
```

**This matches ALL of these:**

```
/docs/intro
/docs/getting-started
/docs/api/auth/login
/docs/a/b/c/d/e
```

### Accessing Catch-All Params:

```jsx
// app/docs/[...slug]/page.js
export default async function DocsPage({ params }) {
  const { slug } = await params;
  // slug is an ARRAY of path segments

  // For /docs/api/auth/login → slug = ['api', 'auth', 'login']
  // For /docs/intro          → slug = ['intro']

  return (
    <div>
      <h1>Docs Page</h1>
      <p>Current path: /docs/{slug.join("/")}</p>
      <p>Segments: {slug.length}</p>
      <ul>
        {slug.map((segment, index) => (
          <li key={index}>{segment}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Optional Catch-All Routes:

```
app/
└── shop/
    └── [[...filters]]/
        └── page.js
```

**This matches ALL of these:**

```
/shop                        → filters = undefined
/shop/electronics            → filters = ['electronics']
/shop/electronics/phones     → filters = ['electronics', 'phones']
```

```jsx
// app/shop/[[...filters]]/page.js
export default async function ShopPage({ params }) {
  const { filters } = await params;

  // filters could be undefined (for /shop)
  if (!filters) {
    return <h1>All Products</h1>;
  }

  return (
    <div>
      <h1>Filtered Products</h1>
      <p>Filters: {filters.join(" > ")}</p>
    </div>
  );
}
```

### Route Priority Order:

```
When multiple routes could match, Next.js follows priority:

1. Static routes:         /docs/intro  (exact match)
2. Dynamic routes:        /docs/[id]
3. Catch-all routes:      /docs/[...slug]
4. Optional catch-all:    /docs/[[...slug]]
```

### Real-World Use Case — Documentation Site:

```jsx
// app/docs/[...slug]/page.js
const docsContent = {
  intro: { title: "Introduction", content: "Welcome to our docs!" },
  "api/auth": { title: "Authentication", content: "API auth docs..." },
  "api/users": { title: "Users API", content: "User endpoints..." },
};

export default async function DocsPage({ params }) {
  const { slug } = await params;
  const path = slug.join("/");
  const doc = docsContent[path];

  if (!doc) {
    return <h1>Documentation page not found</h1>;
  }

  return (
    <article>
      <h1>{doc.title}</h1>
      <p>{doc.content}</p>
    </article>
  );
}
```

### Comparison of Route Types:

| Route Type         | Syntax                 | Matches                |
| ------------------ | ---------------------- | ---------------------- |
| Static             | `/about/page.js`       | `/about` only          |
| Dynamic            | `/[id]/page.js`        | `/1`, `/abc`           |
| Catch-all          | `/[...slug]/page.js`   | `/a`, `/a/b`, `/a/b/c` |
| Optional catch-all | `/[[...slug]]/page.js` | `/`, `/a`, `/a/b`      |

---

# 📝 SET 1 — Quick Revision Cheatsheet

```
┌─────────────────────────────────────────────────────────┐
│                   NEXT.JS SET 1 SUMMARY                 │
├─────────────────────────────────────────────────────────┤
│ SETUP: npx create-next-app@latest my-app                │
│                                                         │
│ ROUTING (File-based):                                   │
│  app/page.js              → /                           │
│  app/about/page.js        → /about                      │
│  app/blog/[id]/page.js    → /blog/123                   │
│  app/docs/[...slug]/page.js → /docs/a/b/c               │
│                                                         │
│ SPECIAL FILES:                                          │
│  page.js    → Route UI                                  │
│  layout.js  → Shared wrapper                            │
│  loading.js → Loading state                             │
│  error.js   → Error state                               │
│  not-found.js → 404 page                                │
│                                                         │
│ NAVIGATION:                                             │
│  <Link href="/about">About</Link>                       │
│  router.push('/dashboard')                              │
│                                                         │
│ DYNAMIC PARAMS (Next.js 15):                            │
│  const { id } = await params;  // Must await!           │
│                                                         │
│ KEY CONCEPTS:                                           │
│  CSR = Browser renders (React default)                  │
│  SSR = Server renders per request                       │
│  SSG = Pre-rendered at build time                       │
└─────────────────────────────────────────────────────────┘
```