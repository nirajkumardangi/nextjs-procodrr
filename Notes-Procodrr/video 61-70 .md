# 📚 Complete Next.js Course Notes — SET 7

### Videos 61–70 | By Anurag Singh (ProCodrr)

---

# 🛡️ VIDEO 61: Protecting Todo Endpoints in Next.js (S9 Ep.5)

## Why Protect API Endpoints?

```
Without Protection:
Anyone can access /api/todos → See ALL users' todos ❌
Anyone can delete /api/todos/1 → Delete anyone's data ❌

With Protection:
Only authenticated users can access their OWN todos ✅
Unauthenticated requests → 401 Unauthorized ✅
```

## Authentication Middleware Pattern for Routes:

```js
// lib/auth.js — Auth helper functions
import { cookies } from "next/headers";
import { connectDB } from "./db";
import User from "@/models/User";

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) return null;

    // Decode token (basic — signing covered in Ep.6)
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");

    return user || null;
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}
```

## Protecting GET Route:

```js
// app/api/todos/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Todo from "@/models/Todo";
import { getAuthUser } from "@/lib/auth";

export async function GET(request) {
  try {
    // Check authentication
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Please login to view todos" },
        { status: 401 },
      );
    }

    await connectDB();

    // Only fetch THIS user's todos
    const todos = await Todo.find({ userId: user._id })
      .sort("-createdAt")
      .lean();

    return NextResponse.json({
      success: true,
      count: todos.length,
      todos,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    await connectDB();
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 422 },
      );
    }

    const todo = await Todo.create({
      title: body.title.trim(),
      completed: false,
      userId: user._id, // Associate with logged-in user
    });

    return NextResponse.json({ success: true, todo }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
```

## Protecting Dynamic Routes:

```js
// app/api/todos/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Todo from "@/models/Todo";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function DELETE(request, { params }) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid todo ID" },
        { status: 400 },
      );
    }

    await connectDB();

    // Find todo AND verify it belongs to this user
    const todo = await Todo.findOne({
      _id: id,
      userId: user._id, // ← Ownership check!
    });

    if (!todo) {
      return NextResponse.json(
        { success: false, error: "Todo not found or access denied" },
        { status: 404 },
      );
    }

    await Todo.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
```

## Reusable Auth Wrapper:

```js
// lib/withAuth.js
import { NextResponse } from "next/server";
import { getAuthUser } from "./auth";

// Higher-order function wrapping route handlers with auth
export function withAuth(handler) {
  return async function (request, context) {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    // Pass user to the actual handler
    return handler(request, context, user);
  };
}
```

```js
// Usage in route handler
import { withAuth } from "@/lib/withAuth";

export const GET = withAuth(async (request, context, user) => {
  // user is available here!
  const todos = await Todo.find({ userId: user._id });
  return Response.json({ todos });
});
```

---

# 🔏 VIDEO 62: Signing Cookies in Next.js (S9 Ep.6)

## Why Sign Cookies?

```
Unsigned Cookie Problem:
Token = base64({ userId: '123' })
→ Anyone can decode and modify it!
→ Attacker changes userId to '456' → Accesses other user's data ❌

Signed Cookie Solution:
Token = data + HMAC signature (using secret key)
→ Signature verification fails if data is tampered ✅
→ Cannot forge valid tokens without the secret key ✅
```

## Installing JWT:

```bash
npm install jsonwebtoken
```

## Environment Variables:

```bash
# .env.local
JWT_SECRET=your-super-secret-key-min-32-chars-long-abc123
JWT_EXPIRES_IN=7d
```

## JWT Helper Functions:

```js
// lib/jwt.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in environment variables");
}

// Create (sign) a token
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

// Verify and decode a token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // Token expired, invalid signature, etc.
    return null;
  }
}

// Decode without verifying (unsafe — only for debugging)
export function decodeToken(token) {
  return jwt.decode(token);
}
```

## Updated Auth Helper with JWT:

```js
// lib/auth.js
import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { connectDB } from "./db";
import User from "@/models/User";

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) return null;

    // Verify JWT signature
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) return null;

    await connectDB();

    const user = await User.findById(decoded.userId).select("-password");

    return user || null;
  } catch (error) {
    console.error("getAuthUser error:", error.message);
    return null;
  }
}
```

## Updated Login Route with JWT:

```js
// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Password check (bcrypt comparison added in Ep.10)
    const isValid = password === user.password;

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Create SIGNED JWT token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set signed token as httpOnly cookie
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 },
    );
  }
}
```

---

# 🗝️ VIDEO 63: Implementing Session-Based Login (S9 Ep.7)

## Session-Based vs Token-Based Auth

```
Token (JWT):
Client stores token in cookie
Server verifies signature only
No DB lookup needed per request
Cannot invalidate before expiry

Session:
Server stores session data in DB
Cookie only holds session ID
DB lookup required per request
Can invalidate anytime (just delete from DB)
```

## Session Model:

```js
// models/Session.js
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    userAgent: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index — auto deletes!
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
```

## Creating Sessions:

```js
// lib/session.js
import crypto from "crypto";
import { connectDB } from "./db";
import Session from "@/models/Session";

// Generate secure random session ID
export function generateSessionId() {
  return crypto.randomBytes(32).toString("hex");
}

// Create session in database
export async function createSession(userId, request) {
  await connectDB();

  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await Session.create({
    userId,
    sessionId,
    userAgent: request.headers.get("user-agent") || "unknown",
    ipAddress: request.headers.get("x-forwarded-for") || "unknown",
    expiresAt,
    isActive: true,
  });

  return session;
}

// Get session from database
export async function getSession(sessionId) {
  await connectDB();

  const session = await Session.findOne({
    sessionId,
    isActive: true,
    expiresAt: { $gt: new Date() }, // Not expired
  }).populate("userId", "-password");

  return session;
}

// Delete session (logout)
export async function deleteSession(sessionId) {
  await connectDB();

  await Session.findOneAndUpdate({ sessionId }, { isActive: false });
}

// Delete ALL sessions for a user (logout all devices)
export async function deleteAllUserSessions(userId) {
  await connectDB();

  await Session.updateMany({ userId }, { isActive: false });
}
```

## Session-Based Login Route:

```js
// app/api/auth/login/route.js (Session Version)
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { createSession } from "@/lib/session";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 },
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user || password !== user.password) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Create session in database
    const session = await createSession(user._id, request);

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    // Store ONLY session ID in cookie (not user data)
    response.cookies.set("sessionId", session.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 },
    );
  }
}
```

## Getting Current User from Session:

```js
// lib/auth.js (Session Version)
import { cookies } from "next/headers";
import { getSession } from "./session";

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) return null;

    // Look up session in database
    const session = await getSession(sessionId);

    if (!session) return null;

    return session.userId; // Populated user document
  } catch (error) {
    return null;
  }
}
```

---

# 👤 VIDEO 64: Adding User Profile Feature (S9 Ep.8)

## Profile API Route:

```js
// app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// GET — Get current user profile
export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PATCH — Update profile
export async function PATCH(request) {
  try {
    const currentUser = await getAuthUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    await connectDB();
    const body = await request.json();

    // Only allow updating safe fields
    const allowedUpdates = {};
    if (body.name) allowedUpdates.name = body.name.trim();

    // Email update requires extra care
    if (body.email && body.email !== currentUser.email) {
      const emailExists = await User.findOne({
        email: body.email.toLowerCase(),
        _id: { $ne: currentUser._id },
      });

      if (emailExists) {
        return NextResponse.json(
          { success: false, error: "Email already in use" },
          { status: 409 },
        );
      }
      allowedUpdates.email = body.email.toLowerCase();
    }

    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      { $set: allowedUpdates },
      { new: true, runValidators: true },
    ).select("-password");

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
```

## Profile Page (Server Component):

```jsx
// app/dashboard/profile/page.jsx
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getAuthUser();

  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white rounded-xl shadow p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 bg-blue-500 rounded-full
                          flex items-center justify-center text-white
                          text-2xl font-bold"
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          {[
            { label: "Full Name", value: user.name },
            { label: "Email", value: user.email },
            { label: "Role", value: user.role },
            {
              label: "Member Since",
              value: new Date(user.createdAt).toLocaleDateString(),
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between py-3 border-b
                         border-gray-100 last:border-0"
            >
              <span className="text-gray-500 font-medium">{item.label}</span>
              <span className="text-gray-800 capitalize">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

# 🚪 VIDEO 65: Implementing Logout Feature (S9 Ep.9)

## Logout API Route:

```js
// app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/session";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    // Delete session from database
    if (sessionId) {
      await deleteSession(sessionId);
    }

    // Clear cookie
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    response.cookies.set("sessionId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    // Also clear JWT cookie if using JWT approach
    response.cookies.set("authToken", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 },
    );
  }
}
```

## Logout Button Component:

```jsx
// components/LogoutButton.jsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/login");
        router.refresh(); // Re-run server components
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-500 text-white px-4 py-2 rounded-lg
                 hover:bg-red-600 disabled:opacity-50
                 transition-colors text-sm font-medium"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
```

## Navigation with Auth State:

```jsx
// components/NavBar.jsx — Server Component
import Link from "next/link";
import { getAuthUser } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function NavBar() {
  const user = await getAuthUser();

  return (
    <nav
      className="bg-white shadow px-6 py-4 flex items-center
                    justify-between"
    >
      <Link href="/" className="text-xl font-bold text-blue-600">
        MyApp
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-600 text-sm">Hi, {user.name}!</span>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-500 text-white px-4 py-2
                         rounded-lg hover:bg-blue-600"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
```

---

# 🔒 VIDEO 66: Hashing Passwords in Next.js (S9 Ep.10)

## Why Hash Passwords?

```
NEVER store plain text passwords!

Plain text storage:
DB breach → Attacker sees: password = "mypassword123" ❌

Hashed storage:
DB breach → Attacker sees: password = "$2b$10$Kd..." ✅
→ Cannot reverse hash to get original password
→ Bcrypt is slow by design (harder to brute force)
```

## Installing bcrypt:

```bash
npm install bcryptjs
# bcryptjs = pure JS implementation (no native deps)
# Works better in serverless environments
```

## Bcrypt Helper Functions:

```js
// lib/bcrypt.js
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12; // Higher = more secure but slower

// Hash a password
export async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
}

// Compare password with hash
export async function comparePasswords(plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
}
```

## Updated Registration with Hashing:

```js
// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/bcrypt";

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password } = await request.json();

    // Validation
    const errors = [];
    if (!name?.trim() || name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      errors.push("Valid email is required");
    }
    if (!password || password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 422 });
    }

    // Check existing user
    const existing = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 },
      );
    }

    // Hash password before saving!
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword, // Store HASH, not plain text
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 },
    );
  }
}
```

## Updated Login with bcrypt Compare:

```js
// app/api/auth/login/route.js — with bcrypt
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { comparePasswords } from "@/lib/bcrypt";
import { signToken } from "@/lib/jwt";

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Compare with bcrypt
    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Create JWT token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 },
    );
  }
}
```

## Bcrypt Cost Factor Guide:

```
SALT_ROUNDS Guide:
──────────────────
8  → Very fast  (~1ms)   — Too weak for production
10 → Fast       (~65ms)  — Development/testing
12 → Moderate   (~250ms) — Recommended for production
14 → Slow       (~1s)    — High security applications

Higher rounds = more secure but slower
Balance security with user experience!
```

---

# 🚀 VIDEO 67: Preparing Next.js App for Deployment (S10 Ep.1)

## Pre-Deployment Checklist:

```
Before deploying, verify:
✅ All environment variables are set
✅ No hardcoded secrets in code
✅ Database connection works
✅ Images configured for production
✅ Error handling in place
✅ Build succeeds locally
✅ No console.log with sensitive data
```

## Environment Variables Setup:

```bash
# .env.local (development — never commit!)
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NEXTAUTH_SECRET=another-secret

# .env.example (commit this — template for others)
MONGODB_URI=your_mongodb_uri_here
JWT_SECRET=your_jwt_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## next.config.js Production Settings:

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization for production
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "your-image-domain.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  // Compress responses
  compress: true,

  // Power by header (optional — remove Next.js fingerprinting)
  poweredByHeader: false,
};

export default nextConfig;
```

## Testing Production Build Locally:

```bash
# Build for production
npm run build

# Output shows:
# ○ Static routes
# λ Dynamic routes
# ● ISR routes

# Start production server locally
npm run start

# Test at http://localhost:3000
```

## Common Build Errors and Fixes:

```bash
# Error: Module not found
→ Check import paths, use @/ alias

# Error: Environment variable undefined
→ Make sure .env.local exists
→ For Next.js public vars: use NEXT_PUBLIC_ prefix

# Error: Image domain not whitelisted
→ Add to next.config.js remotePatterns

# Error: "use client" missing
→ Add 'use client' to components using hooks

# Error: Hydration mismatch
→ Check for browser-only APIs without useEffect
```

## `.gitignore` Configuration:

```
# .gitignore
node_modules/
.next/
.env.local
.env.development.local
.env.test.local
.env.production.local
*.log
.DS_Store
```

---

# ▲ VIDEO 68: Deploying Next.js App on Vercel (S10 Ep.2)

## Why Vercel?

```
Vercel built Next.js → Best integration
✅ Zero-config deployment
✅ Automatic HTTPS/SSL
✅ Global CDN
✅ Automatic preview deployments
✅ Easy environment variable management
✅ Free tier available
✅ Serverless functions support
```

## Deployment Steps:

### Step 1: Push to GitHub

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub then:
git remote add origin https://github.com/username/my-next-app.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

```
1. Go to vercel.com
2. Sign up / Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Next.js settings
6. Add Environment Variables:
   - MONGODB_URI
   - JWT_SECRET
   - any other .env.local variables
7. Click "Deploy"
8. Wait ~2 minutes
9. Your app is live! 🎉
```

## Vercel Environment Variables:

```
In Vercel Dashboard:
Project → Settings → Environment Variables

Add each variable:
Name:  MONGODB_URI
Value: mongodb+srv://...
Environment: Production, Preview, Development

Name:  JWT_SECRET
Value: super-secret-production-key
Environment: Production, Preview, Development
```

## Automatic Deployments:

```
After setup:
Every git push to main → Automatic deployment ✅
Every Pull Request → Preview deployment with unique URL ✅

Workflow:
1. Make changes locally
2. git add . && git commit -m "feature: add X"
3. git push origin main
4. Vercel auto-deploys in ~2 minutes
5. Live at your-app.vercel.app
```

## Vercel CLI (Optional):

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from terminal
vercel

# Deploy to production
vercel --prod

# Pull environment variables locally
vercel env pull .env.local
```

---

# 🌐 VIDEO 69: How to Connect a Custom Domain (S10 Ep.3)

## Adding Custom Domain on Vercel:

```
Steps in Vercel Dashboard:
1. Go to Project → Settings → Domains
2. Enter your domain: myapp.com
3. Vercel shows DNS records to add:
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

4. Go to your domain registrar (GoDaddy, Namecheap, etc.)
5. Add the DNS records
6. Wait for DNS propagation (up to 48hrs, usually ~30min)
7. SSL certificate auto-provisioned by Vercel ✅
```

## DNS Record Types:

```
A Record:
→ Points domain to an IP address
→ myapp.com → 76.76.21.21

CNAME Record:
→ Points subdomain to another domain
→ www.myapp.com → cname.vercel-dns.com

Nameserver (NS) Records:
→ Delegates DNS to another provider
→ myapp.com nameservers → ns1.vercel-dns.com
```

## Custom Domain in next.config.js:

```js
// next.config.js
const nextConfig = {
  // If using custom domain for images
  images: {
    domains: ["myapp.com", "www.myapp.com"],
  },
};

export default nextConfig;
```

## Environment Variable for Production URL:

```bash
# .env.local (development)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Vercel environment variable (production)
NEXT_PUBLIC_APP_URL=https://myapp.com
```

```js
// Usage in code
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

// For OAuth callbacks, email links, etc.
const callbackUrl = `${appUrl}/api/auth/callback`;
```

---

# ⚡ VIDEO 70: What are Server Actions in Next.js? (S11 Ep.1)

## What are Server Actions?

> **Server Actions** are **async functions** that run on the **server** but can be called directly from **Client Components** — without needing to create separate API routes!

```
Traditional approach:
Client Component → fetch('/api/todos', { method: 'POST' })
→ app/api/todos/route.js handles it
→ Response sent back

Server Actions approach:
Client Component → calls createTodo(data) directly
→ Function runs on SERVER automatically
→ Result returned
No API route needed!
```

## Declaring Server Actions:

### Method 1: In a Server Component File

```jsx
// app/todos/page.jsx — Server Component with inline action

export default function TodosPage() {
  // Server Action declared with 'use server'
  async function createTodo(formData) {
    "use server"; // ← This function runs on the server!

    const title = formData.get("title");
    console.log("Running on server:", title);

    // Can directly access database!
    await connectDB();
    await Todo.create({ title });
  }

  return (
    <form action={createTodo}>
      {" "}
      {/* Pass action directly to form */}
      <input type="text" name="title" />
      <button type="submit">Add Todo</button>
    </form>
  );
}
```

### Method 2: Dedicated Server Actions File

```js
// app/_actions/todoActions.js
"use server"; // ← All functions in this file are Server Actions

import { connectDB } from "@/lib/db";
import Todo from "@/models/Todo";
import { revalidatePath } from "next/cache";

export async function createTodo(formData) {
  const title = formData.get("title");

  if (!title?.trim()) {
    return { success: false, error: "Title is required" };
  }

  await connectDB();

  const todo = await Todo.create({
    title: title.trim(),
    completed: false,
  });

  // Revalidate the page to show new todo
  revalidatePath("/todos");

  return { success: true, todo };
}

export async function deleteTodo(id) {
  await connectDB();
  await Todo.findByIdAndDelete(id);
  revalidatePath("/todos");
  return { success: true };
}

export async function toggleTodo(id, completed) {
  await connectDB();
  const todo = await Todo.findByIdAndUpdate(
    id,
    { completed: !completed },
    { new: true },
  );
  revalidatePath("/todos");
  return { success: true, todo };
}
```

## Using Server Actions in Forms:

```jsx
// app/todos/page.jsx — Server Component
import { createTodo, deleteTodo } from "@/app/_actions/todoActions";
import { connectDB } from "@/lib/db";
import Todo from "@/models/Todo";

async function getTodos() {
  await connectDB();
  return Todo.find({}).sort("-createdAt").lean();
}

export default async function TodosPage() {
  const todos = await getTodos();

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Todos</h1>

      {/* Form uses Server Action directly — no API route! */}
      <form action={createTodo} className="flex gap-2 mb-8">
        <input
          type="text"
          name="title"
          placeholder="New todo..."
          className="flex-1 border rounded-lg px-4 py-2"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg"
        >
          Add
        </button>
      </form>

      {/* Todo list */}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center justify-between p-4
                       bg-white rounded-lg border"
          >
            <span
              className={todo.completed ? "line-through text-gray-400" : ""}
            >
              {todo.title}
            </span>

            {/* Delete form with Server Action */}
            <form action={deleteTodo.bind(null, todo._id.toString())}>
              <button type="submit" className="text-red-500 hover:text-red-700">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Server Actions vs API Routes:

```
Feature          | API Routes          | Server Actions
─────────────────────────────────────────────────────
Location         | app/api/*/route.js  | Any file with 'use server'
Called from      | fetch()             | Direct function call
Form integration | Manual fetch POST   | form action={fn} directly
Revalidation     | Manual              | revalidatePath() built-in
Type safety      | Manual              | TypeScript auto-infers
Boilerplate      | More                | Much less
External access  | Yes (HTTP endpoint) | No (server-only)
```

## `revalidatePath` and `revalidateTag`:

```js
// After mutation, tell Next.js which pages to refresh
"use server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createPost(formData) {
  // ... create post in DB

  revalidatePath("/blog"); // Revalidate specific path
  revalidatePath("/blog/[slug]", "page"); // Revalidate dynamic path
  revalidateTag("posts"); // Revalidate by tag
}
```

## Server Action with Redirect:

```js
// app/_actions/authActions.js
"use server";
import { redirect } from "next/navigation";

export async function loginAction(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // Validate and authenticate...
  const isValid = await validateCredentials(email, password);

  if (!isValid) {
    return { error: "Invalid credentials" };
  }

  // Set cookie, create session...

  redirect("/dashboard"); // Redirect after successful login
}
```

---

# 📝 SET 7 — Quick Revision Cheatsheet

```
┌──────────────────────────────────────────────────────────────┐
│                    NEXT.JS SET 7 SUMMARY                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  PROTECTING ENDPOINTS:                                       │
│  getAuthUser() → reads cookie → verifies token → returns user│
│  Check user before every route handler operation             │
│  findOne({ _id: id, userId: user._id }) → ownership check    │
│                                                              │
│  JWT SIGNING:                                                │
│  npm install jsonwebtoken                                    │
│  signToken(payload) → jwt.sign(payload, secret, options)     │
│  verifyToken(token) → jwt.verify(token, secret)              │
│  Store JWT_SECRET in .env.local                              │
│                                                              │
│  SESSION-BASED AUTH:                                         │
│  Session model → stores sessionId, userId, expiresAt         │
│  createSession(userId) → generates random 32-byte hex ID     │
│  Cookie stores sessionId only (not user data)                │
│  MongoDB TTL index → auto-deletes expired sessions           │
│                                                              │
│  PASSWORD HASHING:                                           │
│  npm install bcryptjs                                        │
│  hashPassword(pw) → bcrypt.hash(pw, 12)                      │
│  comparePasswords(pw, hash) → bcrypt.compare(pw, hash)       │
│  NEVER store plain text passwords!                           │
│                                                              │
│  DEPLOYMENT:                                                 │
│  npm run build → test production build                       │
│  Push to GitHub → Import in Vercel                           │
│  Add env vars in Vercel dashboard                            │
│  Custom domain → Add DNS records in registrar                │
│                                                              │
│  SERVER ACTIONS:                                             │
│  'use server' at file/function top                           │
│  Can be called from Client AND Server Components             │
│  form action={serverAction} → no fetch needed                │
│  revalidatePath('/path') → refresh page after mutation       │
│  redirect('/path') → redirect after action                   │
│  No separate API route needed!                               │
│                                                              │
│  AUTH FLOW COMPLETE:                                         │
│  Register → hash pw → save → return user                     │
│  Login → find user → bcrypt.compare → sign JWT → cookie      │
│  Protected → read cookie → verify JWT → get user from DB     │
│  Logout → clear cookie → delete session from DB              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```
