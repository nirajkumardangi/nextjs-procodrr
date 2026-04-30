# 📚 Complete Next.js Course Notes — SET 4

### Videos 31–40 | By Anurag Singh (ProCodrr)

---

# 🔄 VIDEO 31: Rendering Server Components inside Client Components (S4 Ep.6)

## The Core Problem

```
Common Misconception:
❌ "If a Client Component imports a Server Component,
    the Server Component becomes a Client Component"

Reality:
✅ You CAN use Server Components inside Client Components
   BUT you must use the COMPOSITION PATTERN (children/props)
   NOT direct imports inside Client Components
```

## The Wrong Way:

```jsx
// ❌ WRONG — Direct import of Server Component in Client Component
"use client";
import ServerComponent from "./ServerComponent"; // ❌ This makes
// ServerComponent
// behave as client!
export default function ClientComponent() {
  return (
    <div>
      <ServerComponent /> {/* No longer truly a Server Component */}
    </div>
  );
}
```

## The Right Way — Composition Pattern:

```jsx
// ✅ CORRECT — Pass Server Component as children prop

// 1. Server Component (no directive needed)
async function ServerComponent() {
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();
  return <div>Server Data: {data.title}</div>;
}

// 2. Client Component accepts children
("use client");
function ClientWrapper({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && children} {/* Server Component renders here */}
    </div>
  );
}

// 3. Parent Server Component composes them
// app/page.js (Server Component)
export default function Page() {
  return (
    <ClientWrapper>
      <ServerComponent /> {/* Passed as children ✅ */}
    </ClientWrapper>
  );
}
```

## Why This Works:

```
Rendering happens in TWO phases:

Phase 1 (Server):
→ Page.js (Server) renders
→ ServerComponent renders → produces HTML/RSC payload
→ ClientWrapper is identified as Client Component
→ ServerComponent output is "slotted in" as children

Phase 2 (Client):
→ ClientWrapper hydrates with its JS
→ children (ServerComponent output) is already rendered
→ No re-rendering of Server Component needed!
```

## Real-World Example — Modal with Server Data:

```jsx
// components/Modal.jsx — Client Component
"use client";
import { useState } from "react";

export default function Modal({ children, title }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open {title}</button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            <button onClick={() => setIsOpen(false)}>✕ Close</button>
            {children} {/* Server Component content here */}
          </div>
        </div>
      )}
    </div>
  );
}
```

```jsx
// components/UserDetails.jsx — Server Component
async function UserDetails({ userId }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
  );
  const user = await res.json();

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <p>Website: {user.website}</p>
    </div>
  );
}
```

```jsx
// app/users/page.js — Server Component (orchestrates everything)
import Modal from "@/components/Modal";
import UserDetails from "@/components/UserDetails";

export default function UsersPage() {
  return (
    <div>
      <h1>Users</h1>
      {/* Client Modal wraps Server UserDetails */}
      <Modal title="User Info">
        <UserDetails userId={1} /> {/* Server Component as children ✅ */}
      </Modal>
    </div>
  );
}
```

## Passing Server Components as Other Props:

```jsx
// Not just 'children' — any prop works!

// Client Component
'use client';
function Layout({ header, sidebar, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div>
      <header>{header}</header>
      <div style={{ display: 'flex' }}>
        {sidebarOpen && <aside>{sidebar}</aside>}
        <main>{children}</main>
      </div>
      <button onClick={() => setSidebarOpen(!sidebarOpen)}>
        Toggle Sidebar
      </button>
    </div>
  );
}

// Server Component (parent)
async function ServerHeader() {
  const res = await fetch('https://api.example.com/site-config');
  const config = await res.json();
  return <h1>{config.siteName}</h1>;
}

async function ServerSidebar() {
  const res = await fetch('https://api.example.com/nav-items');
  const items = await res.json();
  return <nav>{items.map(i => <a key={i.id} href={i.url}>{i.label}</a>)}</nav>;
}

// app/page.js
export default function Page() {
  return (
    <Layout
      header={<ServerHeader />}    {/* Server Component as prop ✅ */}
      sidebar={<ServerSidebar />}  {/* Server Component as prop ✅ */}
    >
      <p>Main content here</p>
    </Layout>
  );
}
```

---

# 🗃️ VIDEO 32: How to Use Context API and Redux in Next.js (S4 Ep.7)

## Context API in Next.js

### The Problem:

```jsx
// ❌ WRONG — Context Provider in Server Component
// createContext and useContext only work in Client Components!

import { createContext } from "react"; // ❌ Error!

const ThemeContext = createContext("light");

// app/layout.js (Server Component by default)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* ❌ Cannot use Context Provider in Server Component */}
        <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
      </body>
    </html>
  );
}
```

### The Solution — Context Provider as Client Component:

```jsx
// app/_components/ThemeProvider.jsx
"use client"; // ← Must be client component!

import { createContext, useContext, useState } from "react";

// Create context
const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

// Provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for consuming context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

```jsx
// app/layout.js — Server Component
import { ThemeProvider } from "@/app/_components/ThemeProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Client Component Provider wraps everything */}
        <ThemeProvider>
          {children} {/* Can include Server Components! */}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

```jsx
// Consuming context in a Client Component
"use client";
import { useTheme } from "@/app/_components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      style={{
        background: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#fff" : "#333",
        padding: "20px",
      }}
    >
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>
    </div>
  );
}
```

## Complete Auth Context Example:

```jsx
// app/_context/AuthContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  async function login(email, password) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
      return { success: true };
    }
    return { success: false, error: "Invalid credentials" };
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

## Redux in Next.js

### Setup:

```bash
npm install @reduxjs/toolkit react-redux
```

### Creating Redux Store:

```jsx
// app/_store/store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import todosReducer from './todosSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```jsx
// app/_store/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

export const { increment, decrement, incrementByAmount, reset } =
  counterSlice.actions;

export default counterSlice.reducer;
```

### Redux Provider — Must be Client Component:

```jsx
// app/_components/ReduxProvider.jsx
"use client"; // ← Required!

import { Provider } from "react-redux";
import { store } from "@/app/_store/store";

export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
```

```jsx
// app/layout.js
import ReduxProvider from "@/app/_components/ReduxProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
```

### Using Redux in Components:

```jsx
// components/Counter.jsx
"use client";

import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  reset,
  incrementByAmount,
} from "@/app/_store/counterSlice";

export default function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  );
}
```

---

# 🚨 VIDEO 33: Error Handling in Server Components (S5 Ep.1)

## Why Error Handling Matters

```
Without error handling:
Server Component crashes → Entire app crashes → White screen ❌

With error handling:
Server Component crashes → Error boundary catches →
Shows friendly error UI ✅
```

## `error.js` — Error Boundary File

> Create `error.js` in any route folder to handle errors for that route segment.

```
app/
├── error.js              ← Global error boundary
├── page.js
└── products/
    ├── error.js          ← Products-specific error boundary
    ├── page.js
    └── [id]/
        ├── error.js      ← Product detail error boundary
        └── page.js
```

### Basic `error.js`:

```jsx
// app/products/error.js
// MUST be a Client Component!
"use client";

import { useEffect } from "react";

export default function ProductsError({ error, reset }) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Products error:", error);
  }, [error]);

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        background: "#fff5f5",
        border: "1px solid #fc8181",
        borderRadius: "8px",
        margin: "20px",
      }}
    >
      <h2>⚠️ Something went wrong!</h2>
      <p style={{ color: "#c53030" }}>
        {error.message || "An unexpected error occurred"}
      </p>
      <button
        onClick={() => reset()}
        style={{
          background: "#e53e3e",
          color: "white",
          padding: "8px 16px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "16px",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
```

## Props of `error.js`:

```jsx
"use client";

export default function ErrorComponent({
  error, // The Error object
  reset, // Function to retry rendering
}) {
  return (
    <div>
      <h2>Error: {error.message}</h2>
      <p>Digest: {error.digest}</p> {/* Unique error ID for server logs */}
      <button onClick={reset}>Retry</button>
    </div>
  );
}
```

## Triggering Errors in Server Components:

```jsx
// app/products/page.js — Server Component
export default async function ProductsPage() {
  const res = await fetch("https://api.example.com/products");

  // Manually throw error — caught by error.js
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status}`);
  }

  const products = await res.json();

  return (
    <div>
      {products.map((p) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
```

## Error Boundary Hierarchy:

```
Error in /products/[id]/page.js

Caught by nearest error.js:
1. First checks: app/products/[id]/error.js ✅ (if exists)
2. Then checks:  app/products/error.js
3. Then checks:  app/error.js
4. Finally:      Next.js default error page
```

---

# 🔁 VIDEO 34: How to Recover from Errors in Next.js (S5 Ep.2)

## The `reset` Function

> The `reset` function in `error.js` attempts to **re-render** the error boundary's content without a full page reload.

```jsx
// app/dashboard/error.js
"use client";
import { useEffect, useState } from "react";

export default function DashboardError({ error, reset }) {
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  function handleReset() {
    setRetryCount((prev) => prev + 1);
    reset(); // Attempts to re-render the failed component
  }

  return (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <h2>Dashboard Error</h2>
      <p>{error.message}</p>

      {retryCount < 3 ? (
        <button onClick={handleReset}>
          Retry (Attempt {retryCount + 1}/3)
        </button>
      ) : (
        <div>
          <p>Multiple retries failed.</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
          <a href="/">Go to Home</a>
        </div>
      )}
    </div>
  );
}
```

## Auto-Retry Pattern:

```jsx
// app/error.js
"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Auto-retry once after 2 seconds
    const timer = setTimeout(() => {
      reset();
    }, 2000);

    return () => clearTimeout(timer);
  }, [reset]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>Auto-retrying in 2 seconds...</p>
      <button onClick={reset}>Retry Now</button>
    </div>
  );
}
```

---

# 🪆 VIDEO 35: Error Handling in Nested Routes (S5 Ep.3)

## How Errors Bubble Up

```
Route Structure:
app/
├── error.js           ← Level 3 (catches if nothing below catches)
├── dashboard/
│   ├── error.js       ← Level 2
│   └── analytics/
│       ├── error.js   ← Level 1 (catches first)
│       └── page.js    ← Error thrown here

Error in analytics/page.js:
→ Caught by analytics/error.js ✅
→ If not there: dashboard/error.js
→ If not there: root error.js
```

## Errors Don't Affect Sibling Routes:

```jsx
// app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <div>
      <nav>
        {/* Navigation always works! */}
        <a href="/dashboard">Overview</a>
        <a href="/dashboard/analytics">Analytics</a>
        <a href="/dashboard/settings">Settings</a>
      </nav>
      <main>
        {children}
        {/* If children errors, nav still works */}
      </main>
    </div>
  );
}
```

```jsx
// app/dashboard/analytics/error.js
// Only catches errors in analytics route
"use client";

export default function AnalyticsError({ error, reset }) {
  return (
    <div
      style={{
        background: "#fff5f5",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>Analytics Failed to Load</h3>
      <p>{error.message}</p>
      <button onClick={reset}>Retry Analytics</button>
      {/* Dashboard navigation (in layout) still works! */}
    </div>
  );
}
```

## Multiple Error Boundaries in One Page:

```jsx
// app/dashboard/page.js
import { Suspense } from "react";

// These components can each have their own error handling
async function RevenueWidget() {
  const res = await fetch("https://api.example.com/revenue");
  if (!res.ok) throw new Error("Revenue data unavailable");
  const data = await res.json();
  return <div>Revenue: ${data.total}</div>;
}

async function UsersWidget() {
  const res = await fetch("https://api.example.com/users/count");
  if (!res.ok) throw new Error("Users data unavailable");
  const data = await res.json();
  return <div>Users: {data.count}</div>;
}

// Error wrapper for individual sections
// (using React Error Boundary pattern)
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <Suspense fallback={<div>Loading revenue...</div>}>
          <RevenueWidget />
        </Suspense>
        <Suspense fallback={<div>Loading users...</div>}>
          <UsersWidget />
        </Suspense>
      </div>
    </div>
  );
}
```

---

# 💻 VIDEO 36: Handling Client-Side Exceptions in Next.js (S5 Ep.4)

## Client-Side Error Types

```
1. JavaScript Runtime Errors
   → TypeError, ReferenceError, etc.

2. Unhandled Promise Rejections
   → async operations that fail

3. Event Handler Errors
   → Errors inside onClick, onChange, etc.

4. React Rendering Errors
   → Errors during component render
```

## `error.js` for Client Components:

```jsx
// app/dashboard/error.js
// Catches errors from BOTH server and client components in this route!
"use client";

export default function DashboardError({ error, reset }) {
  return (
    <div>
      <h2>Dashboard Error</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  );
}
```

## Try-Catch in Event Handlers:

```jsx
// event handler errors are NOT caught by error.js
// Must handle manually!

"use client";
import { useState } from "react";

export default function PaymentForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handlePayment(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        body: JSON.stringify({ amount: 100 }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Payment failed");
      }

      const result = await res.json();
      alert("Payment successful!");
    } catch (err) {
      // Handle error in UI
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handlePayment}>
      {error && (
        <div style={{ color: "red", padding: "8px", background: "#fff5f5" }}>
          ❌ Error: {error}
        </div>
      )}
      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Pay $100"}
      </button>
    </form>
  );
}
```

## React Error Boundary Class Component:

```jsx
// components/ErrorBoundary.jsx
// For catching errors in specific component trees

import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div>
            <h3>Something went wrong</h3>
            <button onClick={() => this.setState({ hasError: false })}>
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

```jsx
// Using ErrorBoundary
"use client";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Page() {
  return (
    <div>
      <ErrorBoundary fallback={<p>Widget failed to load</p>}>
        <SomeRiskyWidget />
      </ErrorBoundary>
    </div>
  );
}
```

---

# 🌐 VIDEO 37: Global Error Handling in Next.js (S5 Ep.5)

## `global-error.js`

> Handles errors in the **Root Layout** (`app/layout.js`). This is the last resort error boundary.

```
Important: global-error.js:
- Must include <html> and <body> tags
- Replaces the root layout when error occurs
- Must be a Client Component
- Catches errors that error.js CANNOT catch
  (like errors in root layout itself)
```

```jsx
// app/global-error.js
"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "20px",
            textAlign: "center",
            fontFamily: "sans-serif",
          }}
        >
          <h1 style={{ fontSize: "48px" }}>💥</h1>
          <h2>Critical Application Error</h2>
          <p style={{ color: "#666", maxWidth: "400px" }}>
            Something went seriously wrong. Our team has been notified.
          </p>
          <p style={{ color: "#999", fontSize: "14px" }}>
            Error: {error.message}
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button
              onClick={reset}
              style={{
                background: "#3182ce",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                background: "#e2e8f0",
                color: "#333",
                padding: "10px 20px",
                borderRadius: "6px",
                textDecoration: "none",
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
```

## Error Handling Hierarchy — Complete Picture:

```
Error occurs in component

         ↓
Is it in Root Layout?
    YES → global-error.js handles it
    NO  ↓

Does nearest route have error.js?
    YES → That error.js handles it
    NO  ↓

Does parent route have error.js?
    YES → Parent error.js handles it
    NO  ↓

Does app/ have error.js?
    YES → Root error.js handles it
    NO  ↓

global-error.js handles it
```

## Error Logging Integration:

```jsx
// app/error.js — with error logging service
"use client";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    // Send to Sentry, LogRocket, etc.
    logErrorToService(error);
  }, [error]);

  return (
    <div>
      <h2>An error occurred</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

function logErrorToService(error) {
  // Example: Sentry integration
  // Sentry.captureException(error);
  console.error("[Error Service]:", {
    message: error.message,
    digest: error.digest,
    timestamp: new Date().toISOString(),
  });
}
```

---

# 🎨 VIDEO 38: Adding Styles in Next.js Apps (S6 Ep.1)

## Styling Options in Next.js

```
Available styling methods:
1. Global CSS          → app/globals.css
2. CSS Modules         → component.module.css
3. SCSS/SASS           → component.module.scss
4. Tailwind CSS        → utility classes
5. CSS-in-JS           → styled-components, emotion
6. Inline styles       → style={{ }} prop
```

## Global CSS:

```css
/* app/globals.css */

/* CSS Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* CSS Variables */
:root {
  --primary-color: #3182ce;
  --secondary-color: #805ad5;
  --text-color: #2d3748;
  --bg-color: #ffffff;
  --font-sans: "Inter", -apple-system, sans-serif;

  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  --border-radius: 8px;
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --text-color: #f7fafc;
    --bg-color: #1a202c;
  }
}

/* Base styles */
body {
  font-family: var(--font-sans);
  color: var(--text-color);
  background: var(--bg-color);
  line-height: 1.6;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Utility classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.flex {
  display: flex;
}

.grid {
  display: grid;
}

.text-center {
  text-align: center;
}
```

```jsx
// app/layout.js — Import globals ONCE in root layout
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

## Inline Styles in Next.js:

```jsx
// Dynamic styles with JavaScript
export default function Alert({ type, message }) {
  const styles = {
    container: {
      padding: "12px 16px",
      borderRadius: "6px",
      marginBottom: "16px",
      border: "1px solid",
      ...(type === "error" && {
        background: "#fff5f5",
        borderColor: "#fc8181",
        color: "#c53030",
      }),
      ...(type === "success" && {
        background: "#f0fff4",
        borderColor: "#68d391",
        color: "#276749",
      }),
      ...(type === "warning" && {
        background: "#fffaf0",
        borderColor: "#f6ad55",
        color: "#c05621",
      }),
    },
  };

  const icons = { error: "❌", success: "✅", warning: "⚠️" };

  return (
    <div style={styles.container}>
      {icons[type]} {message}
    </div>
  );
}
```

## Google Fonts with Next.js:

```jsx
// app/layout.js
import { Inter, Roboto_Mono } from "next/font/google";

// Configure fonts
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

```css
/* globals.css — Using font variables */
body {
  font-family: var(--font-inter);
}

code,
pre {
  font-family: var(--font-roboto-mono);
}
```

## Local Fonts:

```jsx
// app/layout.js
import localFont from "next/font/local";

const myFont = localFont({
  src: [
    {
      path: "../public/fonts/MyFont-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/MyFont-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-my-font",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.variable}>
      <body>{children}</body>
    </html>
  );
}
```

---

# 📦 VIDEO 39: Using CSS Modules in Next.js (S6 Ep.2)

## What are CSS Modules?

> **CSS Modules** scope CSS to a **specific component** by automatically generating unique class names. No class name conflicts!

```
Normal CSS Problem:
.button { ... }  ← Can conflict with other .button classes globally

CSS Modules Solution:
.button { ... }  ← Becomes .button_abc123 (unique!) ✅
```

## Creating CSS Modules:

```css
/* components/Button.module.css */
/* File must end in .module.css */

.button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.primary {
  background: #3182ce;
  color: white;
}

.primary:hover {
  background: #2c5282;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(49, 130, 206, 0.4);
}

.secondary {
  background: #e2e8f0;
  color: #2d3748;
}

.secondary:hover {
  background: #cbd5e0;
}

.danger {
  background: #e53e3e;
  color: white;
}

.large {
  padding: 14px 28px;
  font-size: 18px;
}

.small {
  padding: 6px 12px;
  font-size: 14px;
}

.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

```jsx
// components/Button.jsx
import styles from "./Button.module.css";

export default function Button({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
}) {
  // Combining multiple CSS module classes
  const classNames = [
    styles.button,
    styles[variant], // styles.primary / styles.secondary
    size === "large" && styles.large,
    size === "small" && styles.small,
    disabled && styles.disabled,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classNames} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
```

## CSS Module for Page:

```css
/* app/home/Home.module.css */

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.heroTitle {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 16px;
  line-height: 1.2;
}

.heroSubtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto 32px;
}

.heroButtons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  padding: 48px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.cardIcon {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.cardTitle {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
}
```

```jsx
// app/page.js
import styles from "./Home.module.css";

export default function HomePage() {
  const features = [
    { icon: "⚡", title: "Fast", desc: "Optimized performance" },
    { icon: "🔒", title: "Secure", desc: "Built-in security" },
    { icon: "📱", title: "Responsive", desc: "Works on all devices" },
  ];

  return (
    <main>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Welcome to My App</h1>
        <p className={styles.heroSubtitle}>Build amazing things with Next.js</p>
      </section>

      <div className={styles.grid}>
        {features.map((feature) => (
          <div key={feature.title} className={styles.card}>
            <div className={styles.cardIcon}>{feature.icon}</div>
            <h3 className={styles.cardTitle}>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
```

## Composing CSS Modules with `clsx`:

```bash
npm install clsx
```

```jsx
// Much cleaner class composition
import clsx from "clsx";
import styles from "./Card.module.css";

export default function Card({ variant, isActive, size, children }) {
  return (
    <div
      className={clsx(
        styles.card,
        styles[variant], // Dynamic variant class
        isActive && styles.active, // Conditional class
        {
          [styles.large]: size === "lg",
          [styles.small]: size === "sm",
        },
      )}
    >
      {children}
    </div>
  );
}
```

---

# 🎯 VIDEO 40: Using SCSS in Next.js (S6 Ep.3)

## Setting Up SCSS:

```bash
npm install --save-dev sass
```

> That's it! Next.js has built-in SCSS support. Just change `.css` to `.scss`.

## SCSS Features Used in Next.js:

### Variables and Nesting:

```scss
/* styles/variables.scss */
$primary: #3182ce;
$secondary: #805ad5;
$danger: #e53e3e;
$success: #38a169;

$text-dark: #2d3748;
$text-light: #718096;

$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 48px;

$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 16px;

$shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
$shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);

$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
```

```scss
/* components/Navbar.module.scss */
@use "../styles/variables" as v;

.navbar {
  background: white;
  box-shadow: v.$shadow-sm;
  padding: v.$spacing-md v.$spacing-lg;

  // Nesting
  .container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: 800;
    color: v.$primary;
    text-decoration: none;

    &:hover {
      opacity: 0.8;
    }
  }

  .navLinks {
    display: flex;
    gap: v.$spacing-lg;
    list-style: none;

    li a {
      color: v.$text-dark;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;

      &:hover,
      &.active {
        color: v.$primary;
      }
    }
  }

  // Responsive
  @media (max-width: v.$breakpoint-md) {
    .navLinks {
      display: none;
    }
  }
}
```

### Mixins:

```scss
/* styles/mixins.scss */

// Flexbox mixin
@mixin flex($direction: row, $justify: flex-start, $align: stretch) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}

// Responsive mixin
@mixin responsive($breakpoint) {
  @if $breakpoint == sm {
    @media (max-width: 640px) {
      @content;
    }
  } @else if $breakpoint == md {
    @media (max-width: 768px) {
      @content;
    }
  } @else if $breakpoint == lg {
    @media (max-width: 1024px) {
      @content;
    }
  }
}

// Truncate text mixin
@mixin truncate($lines: 1) {
  @if $lines == 1 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

```scss
/* components/Card.module.scss */
@use "../styles/variables" as v;
@use "../styles/mixins" as m;

.card {
  background: white;
  border-radius: v.$radius-md;
  box-shadow: v.$shadow-sm;
  overflow: hidden;
  transition:
    box-shadow 0.2s,
    transform 0.2s;

  &:hover {
    box-shadow: v.$shadow-md;
    transform: translateY(-2px);
  }

  .cardImage {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .cardBody {
    padding: v.$spacing-md;
    @include m.flex(column, flex-start, flex-start);
    gap: v.$spacing-sm;
  }

  .cardTitle {
    font-size: 1.125rem;
    font-weight: 600;
    color: v.$text-dark;
    @include m.truncate(2); // Truncate at 2 lines
  }

  .cardPrice {
    font-size: 1.25rem;
    font-weight: 700;
    color: v.$primary;
  }

  @include m.responsive(sm) {
    .cardImage {
      height: 150px;
    }
  }
}
```

```jsx
// components/Card.jsx
import styles from "./Card.module.scss";

export default function Card({ image, title, price }) {
  return (
    <div className={styles.card}>
      <img src={image} alt={title} className={styles.cardImage} />
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <span className={styles.cardPrice}>${price}</span>
      </div>
    </div>
  );
}
```

### Global SCSS:

```scss
/* app/globals.scss */
@use "./styles/variables" as v;

// Import and use variables in global styles
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Inter", sans-serif;
  color: v.$text-dark;
  background: #f7fafc;
}
```

```jsx
// app/layout.js
import "./globals.scss"; // Import .scss instead of .css

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

---

# 📝 SET 4 — Quick Revision Cheatsheet

```
┌──────────────────────────────────────────────────────────────┐
│                    NEXT.JS SET 4 SUMMARY                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SERVER IN CLIENT COMPONENTS:                                │
│  ❌ Direct import of Server in Client Component              │
│  ✅ Pass Server Component as children/props                  │
│  Parent (Server) → Client Wrapper → Server children          │
│                                                              │
│  CONTEXT API:                                                │
│  Provider must be 'use client' component                     │
│  Wrap in layout.js                                           │
│  Children (including Server Components) still work ✅        │
│                                                              │
│  REDUX:                                                      │
│  npm install @reduxjs/toolkit react-redux                    │
│  ReduxProvider.jsx → 'use client' → wrap in layout           │
│                                                              │
│  ERROR HANDLING FILES:                                       │
│  error.js      → Route-level (must be 'use client')          │
│  global-error.js → Root layout errors (needs html+body)      │
│  Props: { error, reset }                                     │
│  reset() → Retry rendering                                   │
│  Error bubbles up to nearest error.js                        │
│                                                              │
│  STYLING OPTIONS:                                            │
│  globals.css → Import once in root layout                    │
│  *.module.css → Scoped CSS (no conflicts)                    │
│  *.module.scss → SCSS modules (install sass)                 │
│  CSS Variables: --var-name in :root                          │
│                                                              │
│  CSS MODULES:                                                │
│  import styles from './Component.module.css'                 │
│  className={styles.myClass}                                  │
│  Multiple: clsx(styles.a, styles.b, isX && styles.c)         │
│                                                              │
│  SCSS SETUP:                                                 │
│  npm install --save-dev sass                                 │
│  Rename .css → .scss → Works automatically                   │
│  Features: variables, nesting, mixins, @use                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```
