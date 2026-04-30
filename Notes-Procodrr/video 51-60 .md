# 📚 Complete Next.js Course Notes — SET 6

### Videos 51–60 | By Anurag Singh (ProCodrr)

---

# 🔗 VIDEO 51: Integrating GET and POST Todo APIs (S7 Ep.8)

## Frontend Integration with Backend APIs

> This video covers connecting the React frontend (Client Components) with the Next.js API routes we built.

## Complete Todo App — Frontend Integration:

### State Management for Todos:

```jsx
// app/todos/page.jsx
"use client";
import { useState, useEffect } from "react";

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  // GET — Fetch all todos
  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      setLoading(true);
      const res = await fetch("/api/todos");

      if (!res.ok) throw new Error("Failed to fetch todos");

      const data = await res.json();
      setTodos(data.todos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // POST — Create new todo
  async function handleCreate(e) {
    e.preventDefault();

    if (!newTitle.trim()) return;

    try {
      setCreating(true);
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create todo");
      }

      // Add new todo to state
      setTodos((prev) => [...prev, data.todo]);
      setNewTitle(""); // Clear input
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-500">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">My Todos</h1>

      {/* Error message */}
      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700
                        p-4 rounded-lg mb-6"
        >
          ❌ {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Create Todo Form */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 border border-gray-300 rounded-lg
                     px-4 py-2 focus:outline-none focus:ring-2
                     focus:ring-blue-500"
          disabled={creating}
        />
        <button
          type="submit"
          disabled={creating || !newTitle.trim()}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg
                     hover:bg-blue-600 disabled:opacity-50
                     disabled:cursor-not-allowed transition-colors"
        >
          {creating ? "Adding..." : "Add Todo"}
        </button>
      </form>

      {/* Todo Count */}
      <p className="text-gray-500 mb-4">
        {todos.length} todo{todos.length !== 1 ? "s" : ""}
      </p>

      {/* Todo List */}
      {todos.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          <p className="text-5xl mb-4">📝</p>
          <p>No todos yet. Add one above!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 p-4 bg-white
                         rounded-lg shadow-sm border border-gray-100"
            >
              <span
                className={`flex-1 ${
                  todo.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }`}
              >
                {todo.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

# ✏️ VIDEO 52: Integrating PUT and DELETE Todo APIs (S7 Ep.9)

## Adding Edit and Delete to Frontend:

```jsx
// app/todos/page.jsx — Complete with PUT and DELETE
"use client";
import { useState, useEffect } from "react";

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    setLoading(true);
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data.todos);
    setLoading(false);
  }

  // POST
  async function handleCreate(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    const data = await res.json();

    if (res.ok) {
      setTodos((prev) => [...prev, data.todo]);
      setNewTitle("");
    }
  }

  // Toggle complete — PATCH
  async function handleToggle(todo) {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    const data = await res.json();

    if (res.ok) {
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? data.todo : t)));
    }
  }

  // Start editing
  function startEdit(todo) {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  }

  // PUT — Save edit
  async function handleEdit(id) {
    if (!editTitle.trim()) return;

    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        completed: todos.find((t) => t.id === id)?.completed,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      setTodos((prev) => prev.map((t) => (t.id === id ? data.todo : t)));
      setEditingId(null);
      setEditTitle("");
    }
  }

  // DELETE
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    const res = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    }
  }

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Todo App</h1>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New todo..."
          className="flex-1 border rounded-lg px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg
                     hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </form>

      {/* Todo List */}
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 p-4 bg-white
                       rounded-lg border border-gray-200"
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo)}
              className="w-4 h-4 cursor-pointer"
            />

            {/* Title or Edit Input */}
            {editingId === todo.id ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEdit(todo.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="flex-1 border rounded px-2 py-1
                           focus:outline-none focus:ring-1"
                autoFocus
              />
            ) : (
              <span
                className={`flex-1 ${
                  todo.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {todo.title}
              </span>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {editingId === todo.id ? (
                <>
                  <button
                    onClick={() => handleEdit(todo.id)}
                    className="text-green-600 hover:text-green-700
                               text-sm font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-500 hover:text-gray-700
                               text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(todo)}
                    className="text-blue-500 hover:text-blue-700
                               text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-red-500 hover:text-red-700
                               text-sm"
                  >
                    🗑️ Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

# 🍃 VIDEO 53: Connecting MongoDB in Next.js (S8 Ep.1)

## Why MongoDB?

```
MongoDB is a NoSQL database:
✅ Stores data as JSON-like documents
✅ Flexible schema (no rigid tables)
✅ Scales easily
✅ Great with JavaScript/Node.js
✅ Free tier available (MongoDB Atlas)
```

## Setup — MongoDB Atlas (Cloud):

```
Steps:
1. Go to mongodb.com/cloud/atlas
2. Create free account
3. Create a new Cluster (free tier M0)
4. Create database user (username + password)
5. Add IP whitelist (0.0.0.0/0 for development)
6. Get connection string
```

## Install Mongoose:

```bash
npm install mongoose
```

## Environment Variables:

```bash
# .env.local
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
```

```bash
# .env.local example
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/nextjs-todo?retryWrites=true&w=majority
```

## Database Connection Helper:

```js
// lib/db.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local",
  );
}

// Global cache to prevent multiple connections in development
// (Next.js hot reloads can create multiple connections)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection if no promise exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
```

## Testing Connection:

```js
// app/api/test-db/route.js
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      success: true,
      message: "Database connected successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
```

---

# 📐 VIDEO 54: Creating Mongoose Model in Next.js (S8 Ep.2)

## What is a Mongoose Model?

```
Mongoose Model:
→ Defines the SHAPE of documents in a collection
→ Provides methods to interact with the database
→ Adds validation and data types

Collection = SQL Table
Document   = SQL Row
Field      = SQL Column
```

## Creating Todo Model:

```js
// models/Todo.js
import mongoose from "mongoose";

// Define Schema (shape of data)
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true  // Uncomment when auth is added
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  {
    timestamps: true, // Auto-adds createdAt and updatedAt
  },
);

// Prevent model recompilation in development (hot reload issue)
const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default Todo;
```

## User Model:

```js
// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
```

## Mongoose Data Types Reference:

```js
// Common Mongoose Schema Types
const exampleSchema = new mongoose.Schema({
  name: { type: String },
  age: { type: Number },
  isActive: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
  tags: { type: [String] }, // Array of strings
  address: {
    // Nested object
    street: String,
    city: String,
    zip: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to another model
    ref: "User",
  },
});
```

---

# 💾 VIDEO 55: MongoDB CRUD Operations in Next.js — Part 1 (S8 Ep.3)

## GET and POST with MongoDB:

```js
// app/api/todos/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Todo from "@/models/Todo";

// GET — Fetch all todos from MongoDB
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const completed = searchParams.get("completed");
    const sort = searchParams.get("sort") || "-createdAt"; // Default: newest first
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build query filter
    const filter = {};
    if (completed !== null) {
      filter.completed = completed === "true";
    }

    // Execute query with filter, sort, pagination
    const skip = (page - 1) * limit;

    const [todos, total] = await Promise.all([
      Todo.find(filter).sort(sort).skip(skip).limit(limit).lean(), // Returns plain JS object (faster)
      Todo.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        todos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST — Create new todo in MongoDB
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // Mongoose handles validation based on schema!
    const todo = await Todo.create({
      title: body.title,
      completed: body.completed || false,
      priority: body.priority || "medium",
    });

    return NextResponse.json({ success: true, todo }, { status: 201 });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json({ success: false, errors }, { status: 422 });
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
```

---

# 🔄 VIDEO 56: MongoDB CRUD Operations in Next.js — Part 2 (S8 Ep.4)

## GET, PUT, DELETE with MongoDB:

```js
// app/api/todos/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Todo from "@/models/Todo";
import mongoose from "mongoose";

// Helper to validate MongoDB ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET — Single todo
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid todo ID format" },
        { status: 400 },
      );
    }

    const todo = await Todo.findById(id);

    if (!todo) {
      return NextResponse.json(
        { success: false, error: "Todo not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, todo });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PUT — Full update
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID" },
        { status: 400 },
      );
    }

    const todo = await Todo.findByIdAndUpdate(
      id,
      {
        title: body.title,
        completed: body.completed,
        priority: body.priority,
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validation
      },
    );

    if (!todo) {
      return NextResponse.json(
        { success: false, error: "Todo not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Todo updated",
      todo,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json({ success: false, errors }, { status: 422 });
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PATCH — Partial update
export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID" },
        { status: 400 },
      );
    }

    // Only update fields provided in body
    const updateFields = {};
    if (body.title !== undefined) updateFields.title = body.title;
    if (body.completed !== undefined) updateFields.completed = body.completed;
    if (body.priority !== undefined) updateFields.priority = body.priority;

    const todo = await Todo.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    if (!todo) {
      return NextResponse.json(
        { success: false, error: "Todo not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, todo });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// DELETE
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID" },
        { status: 400 },
      );
    }

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return NextResponse.json(
        { success: false, error: "Todo not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Todo deleted successfully",
      todo,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
```

## Mongoose Query Methods Reference:

```js
// Find operations
await Todo.find({})                    // Find all
await Todo.find({ completed: true })   // Find with filter
await Todo.findById(id)                // Find by MongoDB _id
await Todo.findOne({ email: 'x' })    // Find first match

// Create operations
await Todo.create({ title: 'Test' })  // Create one
await Todo.insertMany([...])          // Create many

// Update operations
await Todo.findByIdAndUpdate(id, data, { new: true })
await Todo.findOneAndUpdate({ email }, data, { new: true })
await Todo.updateMany({ completed: false }, { $set: { priority: 'low' } })

// Delete operations
await Todo.findByIdAndDelete(id)
await Todo.findOneAndDelete({ title: 'Test' })
await Todo.deleteMany({ completed: true })

// Count
await Todo.countDocuments({ completed: false })

// Sort, Skip, Limit
await Todo.find({}).sort('-createdAt').skip(10).limit(10)

// Select specific fields
await Todo.find({}).select('title completed -_id')

// Populate referenced documents
await Todo.find({}).populate('userId', 'name email')
```

---

# 🔐 VIDEO 57: Understanding Auth Flow in Next.js (S9 Ep.1)

## Authentication Concepts

```
Authentication = WHO are you? (Identity)
Authorization  = WHAT can you do? (Permissions)

Common Auth Methods:
1. Session-based Auth  → Server stores session
2. JWT (Token-based)   → Client stores token
3. Cookie-based        → Token stored in cookie
4. OAuth               → Login with Google/GitHub
```

## Auth Flow Overview:

```
REGISTRATION FLOW:
──────────────────
User fills form → POST /api/auth/register
→ Validate data
→ Check if email exists
→ Hash password (bcrypt)
→ Save user to DB
→ Create session/token
→ Set cookie
→ Redirect to dashboard

LOGIN FLOW:
───────────
User enters credentials → POST /api/auth/login
→ Find user by email
→ Compare password with hash
→ If match: create session/token
→ Set cookie
→ Redirect to dashboard

PROTECTED ROUTE FLOW:
──────────────────────
Request to /dashboard
→ Middleware checks cookie
→ Verify token/session
→ If valid: allow access
→ If invalid: redirect to /login

LOGOUT FLOW:
────────────
User clicks logout → POST /api/auth/logout
→ Delete session from DB (session-based)
→ Clear cookie
→ Redirect to /login
```

## Cookie-Based Auth vs JWT:

```
Cookie-Based (Session):
✅ More secure (httpOnly cookie)
✅ Easy to invalidate (delete from DB)
✅ No token expiry management needed
❌ Server must store sessions
❌ Scaling requires shared session store

JWT (Token-Based):
✅ Stateless (no server storage)
✅ Easy to scale
❌ Cannot invalidate before expiry
❌ Larger token size
❌ Must handle refresh tokens
```

## Project Auth Structure:

```
app/
├── api/
│   └── auth/
│       ├── register/
│       │   └── route.js
│       ├── login/
│       │   └── route.js
│       ├── logout/
│       │   └── route.js
│       └── me/
│           └── route.js
├── (auth)/
│   ├── login/
│   │   └── page.jsx
│   └── register/
│       └── page.jsx
└── middleware.js        ← Protects routes
```

---

# 👤 VIDEO 58: User Registration in Next.js (S9 Ep.2)

## Registration API Route:

```js
// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, password } = body;

    // --- Validation ---
    const errors = [];

    if (!name || name.trim().length < 2) {
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

    // --- Check if email already exists ---
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 },
      );
    }

    // --- Create user (password hashing added in Video 66) ---
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password, // Will be hashed in S9 Ep.10
    });

    // Don't return password in response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: userResponse,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json({ success: false, errors }, { status: 422 });
    }

    return NextResponse.json(
      { success: false, error: "Registration failed. Please try again." },
      { status: 500 },
    );
  }
}
```

## Registration Form (Frontend):

```jsx
// app/(auth)/register/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  // Client-side validation
  function validateForm() {
    const errs = [];

    if (!formData.name.trim() || formData.name.length < 2) {
      errs.push("Name must be at least 2 characters");
    }

    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.push("Valid email is required");
    }

    if (!formData.password || formData.password.length < 8) {
      errs.push("Password must be at least 8 characters");
    }

    if (formData.password !== formData.confirmPassword) {
      errs.push("Passwords do not match");
    }

    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);

    // Client-side validation first
    const clientErrors = validateForm();
    if (clientErrors.length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || [data.error]);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setErrors(["Something went wrong. Please try again."]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center
                    bg-gray-50 px-4"
    >
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        {success && (
          <div
            className="bg-green-50 border border-green-200
                          text-green-700 p-4 rounded-lg mb-4"
          >
            ✅ Account created! Redirecting to login...
          </div>
        )}

        {errors.length > 0 && (
          <div
            className="bg-red-50 border border-red-200
                          text-red-700 p-4 rounded-lg mb-4"
          >
            <ul className="list-disc list-inside space-y-1">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            {
              name: "name",
              label: "Full Name",
              type: "text",
              placeholder: "John Doe",
            },
            {
              name: "email",
              label: "Email",
              type: "email",
              placeholder: "john@example.com",
            },
            {
              name: "password",
              label: "Password",
              type: "password",
              placeholder: "••••••••",
            },
            {
              name: "confirmPassword",
              label: "Confirm Password",
              type: "password",
              placeholder: "••••••••",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full border border-gray-300 rounded-lg
                           px-4 py-2 focus:outline-none
                           focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3
                       rounded-lg font-semibold hover:bg-blue-600
                       disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
```

---

# 🍪 VIDEO 59: Working with Cookies in Next.js (S9 Ep.3)

## Cookies in Next.js

```
Types of Cookies:
─────────────────
httpOnly  → Cannot be accessed by JavaScript (secure!)
secure    → Only sent over HTTPS
sameSite  → Controls cross-site sending
maxAge    → Expiry time in seconds
path      → Which paths the cookie applies to
```

## Setting Cookies in Route Handlers:

```js
// app/api/auth/set-cookie/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  const response = NextResponse.json({
    success: true,
    message: "Cookie set!",
  });

  // Set a basic cookie
  response.cookies.set("username", "john_doe", {
    httpOnly: true, // Not accessible via JavaScript
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // 'strict' | 'lax' | 'none'
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    path: "/",
  });

  return response;
}
```

## Reading Cookies in Route Handlers:

```js
// app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  // Method 1: Using next/headers (recommended for Route Handlers)
  const cookieStore = await cookies();

  const token = cookieStore.get("authToken");
  const username = cookieStore.get("username");

  // Get all cookies
  const allCookies = cookieStore.getAll();

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    success: true,
    token: token.value,
    username: username?.value,
  });
}
```

## Deleting Cookies (Logout):

```js
// app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Delete cookie by setting maxAge to 0
  response.cookies.set("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // Immediately expires the cookie
    path: "/",
  });

  return response;
}
```

## Reading Cookies in Server Components:

```jsx
// app/dashboard/page.jsx — Server Component
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken");

  // Redirect if not authenticated
  if (!token) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome! You are authenticated.</p>
    </div>
  );
}
```

## Cookie Utility Helper:

```js
// lib/cookies.js
import { cookies } from "next/headers";

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("authToken")?.value || null;
}

export function setAuthCookie(response, token) {
  response.cookies.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return response;
}

export function clearAuthCookie(response) {
  response.cookies.set("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
```

---

# 🔑 VIDEO 60: Implement Login Feature in Next.js (S9 Ep.4)

## Login API Route:

```js
// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Find user and include password field
    // (select: false in schema means we must explicitly request it)
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    // User not found
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Password comparison (plain text for now — bcrypt added in Ep.10)
    // In production ALWAYS hash passwords!
    const isPasswordValid = password === user.password;

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Create simple token (signing covered in Ep.6)
    const token = Buffer.from(
      JSON.stringify({ userId: user._id, email: user.email }),
    ).toString("base64");

    // Build response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    // Set auth cookie
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Login failed. Please try again." },
      { status: 500 },
    );
  }
}
```

## Login Form (Frontend):

```jsx
// app/(auth)/login/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Redirect to dashboard on success
      router.push("/dashboard");
      router.refresh(); // Refresh server components
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center
                    bg-gray-50 px-4"
    >
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Welcome Back</h1>
        <p className="text-gray-500 text-center mb-6">
          Sign in to your account
        </p>

        {error && (
          <div
            className="bg-red-50 border border-red-200
                          text-red-700 p-4 rounded-lg mb-4 text-sm"
          >
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium
                               text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full border border-gray-300 rounded-lg
                         px-4 py-2 focus:outline-none
                         focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium
                               text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg
                         px-4 py-2 focus:outline-none
                         focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3
                       rounded-lg font-semibold hover:bg-blue-600
                       disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
```

---

# 📝 SET 6 — Quick Revision Cheatsheet

```
┌──────────────────────────────────────────────────────────────┐
│                    NEXT.JS SET 6 SUMMARY                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  FRONTEND-BACKEND INTEGRATION:                               │
│  fetch('/api/todos')              → GET all                  │
│  fetch('/api/todos', {            → POST create              │
│    method: 'POST',                                           │
│    headers: {'Content-Type': 'application/json'},            │
│    body: JSON.stringify(data)                                │
│  })                                                          │
│  fetch('/api/todos/:id', { method: 'PUT/PATCH/DELETE' })     │
│                                                              │
│  MONGODB SETUP:                                              │
│  npm install mongoose                                        │
│  MONGODB_URI in .env.local                                   │
│  lib/db.js → connectDB() with global cache                   │
│  models/Todo.js → mongoose.models.X || mongoose.model(X)     │
│                                                              │
│  MONGOOSE CRUD:                                              │
│  Model.find({})                   → Get all                  │
│  Model.findById(id)               → Get one                  │
│  Model.create(data)               → Create                   │
│  Model.findByIdAndUpdate(id,data,{new:true}) → Update        │
│  Model.findByIdAndDelete(id)      → Delete                   │
│                                                              │
│  AUTH FLOW:                                                  │
│  Register → Validate → Hash PW → Save → Set Cookie           │
│  Login → Find User → Compare PW → Set Cookie                 │
│  Protected → Check Cookie → Verify → Allow/Redirect          │
│  Logout → Clear Cookie → Redirect                            │
│                                                              │
│  COOKIES:                                                    │
│  Set: response.cookies.set('name', value, options)           │
│  Get: (await cookies()).get('name')?.value                   │
│  Delete: set with maxAge: 0                                  │
│  Options: httpOnly, secure, sameSite, maxAge, path           │
│                                                              │
│  KEY SECURITY RULES:                                         │
│  ✅ httpOnly cookies (no JS access)                          │
│  ✅ secure: true in production (HTTPS only)                  │
│  ✅ Hash passwords (never store plain text)                  │
│  ✅ Never expose sensitive data in responses                 │
│  ✅ Validate ALL input server-side                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```
