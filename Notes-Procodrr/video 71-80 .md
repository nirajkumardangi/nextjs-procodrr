# 📚 Complete Next.js Course Notes — SET 8

### Videos 71–80 | By Anurag Singh (ProCodrr)

---

# 🔁 VIDEO 71: Using Server Actions in Client Components (S11 Ep.2)

## Server Actions in Client Components

> Server Actions can be **imported and called** directly from Client Components — this is one of their most powerful features!

## The Key Rule:

```
Server Actions defined in a separate file
with 'use server' at the TOP of the file
can be imported into Client Components

BUT:
You CANNOT define a Server Action inside
a Client Component ('use client' file)
```

## File Structure:

```
app/
├── _actions/
│   └── todoActions.js    ← 'use server' at top
└── todos/
    ├── page.jsx          ← Server Component
    └── TodoForm.jsx      ← 'use client' Client Component
```

## Server Actions File:

```js
// app/_actions/todoActions.js
"use server"; // ← Makes ALL exports Server Actions

import { connectDB } from "@/lib/db";
import Todo from "@/models/Todo";
import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/lib/auth";

export async function createTodo(formData) {
  const user = await getAuthUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const title = formData.get("title");

  if (!title?.trim()) {
    return { success: false, error: "Title is required" };
  }

  try {
    await connectDB();

    const todo = await Todo.create({
      title: title.trim(),
      completed: false,
      userId: user._id,
    });

    revalidatePath("/todos");

    return { success: true, todo: JSON.parse(JSON.stringify(todo)) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteTodo(id) {
  const user = await getAuthUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await connectDB();
    await Todo.findOneAndDelete({ _id: id, userId: user._id });
    revalidatePath("/todos");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## Client Component Using Server Action:

```jsx
// app/todos/TodoForm.jsx
"use client";

import { useState } from "react";
import { createTodo } from "@/app/_actions/todoActions";

export default function TodoForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.target);

    try {
      // Call Server Action directly — no fetch needed!
      const result = await createTodo(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      // Clear form on success
      event.target.reset();
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && (
        <p
          className="text-red-500 text-sm bg-red-50
                      px-3 py-2 rounded-lg"
        >
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          name="title"
          placeholder="Add a new todo..."
          disabled={loading}
          className="flex-1 border border-gray-300 rounded-lg
                     px-4 py-2 focus:outline-none
                     focus:ring-2 focus:ring-blue-500
                     disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2
                     rounded-lg hover:bg-blue-600
                     disabled:opacity-50 transition-colors"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}
```

## Passing Arguments to Server Actions:

```js
// app/_actions/todoActions.js
"use server";

// Method 1: Using .bind() to pre-fill arguments
export async function updateTodoStatus(id, completed, formData) {
  await connectDB();
  await Todo.findByIdAndUpdate(id, { completed });
  revalidatePath("/todos");
  return { success: true };
}
```

```jsx
// Usage with .bind()
import { updateTodoStatus } from "@/app/_actions/todoActions";

export default function TodoItem({ todo }) {
  // Pre-bind the id and completed arguments
  const toggleAction = updateTodoStatus.bind(null, todo._id, !todo.completed);

  return (
    <form action={toggleAction}>
      <button type="submit">
        {todo.completed ? "Mark Incomplete" : "Mark Complete"}
      </button>
    </form>
  );
}
```

## Progressive Enhancement:

```
Server Actions work even WITHOUT JavaScript!

With JS:   Form submits → Server Action runs → UI updates
Without JS: Form submits → Full page reload → Action still runs

This is the power of Server Actions —
they degrade gracefully!
```

---

# 🎣 VIDEO 72: useActionState Hook Explained in Next.js (S11 Ep.3)

## What is `useActionState`?

> `useActionState` is a React hook that manages the **state** of a Server Action — tracking its return value and pending status.

```
Without useActionState:
→ Manually manage loading state with useState
→ Manually handle action result
→ More boilerplate code

With useActionState:
→ Automatically tracks action state
→ Built-in pending state
→ Less boilerplate
→ Better progressive enhancement
```

## Basic `useActionState` Usage:

```jsx
// app/todos/TodoForm.jsx
"use client";

import { useActionState } from "react";
import { createTodo } from "@/app/_actions/todoActions";

// Server Action must accept (prevState, formData)
// app/_actions/todoActions.js
// export async function createTodo(prevState, formData) { ... }

export default function TodoForm() {
  // useActionState(action, initialState)
  const [state, formAction, isPending] = useActionState(
    createTodo,
    { success: false, error: null }, // Initial state
  );

  return (
    <div>
      {/* Show error from Server Action result */}
      {state?.error && (
        <p className="text-red-500 text-sm mb-3">❌ {state.error}</p>
      )}

      {/* Show success message */}
      {state?.success && (
        <p className="text-green-500 text-sm mb-3">
          ✅ Todo created successfully!
        </p>
      )}

      {/* form action = formAction from useActionState */}
      <form action={formAction} className="flex gap-2">
        <input
          type="text"
          name="title"
          placeholder="New todo..."
          disabled={isPending}
          className="flex-1 border rounded-lg px-4 py-2
                     focus:outline-none focus:ring-2
                     focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-500 text-white px-6 py-2
                     rounded-lg hover:bg-blue-600
                     disabled:opacity-50 transition-colors"
        >
          {isPending ? "Adding..." : "Add Todo"}
        </button>
      </form>
    </div>
  );
}
```

## Updated Server Action for `useActionState`:

```js
// app/_actions/todoActions.js
"use server";

import { connectDB } from "@/lib/db";
import Todo from "@/models/Todo";
import { revalidatePath } from "next/cache";

// Action receives (prevState, formData)
// prevState = previous return value of this action
export async function createTodo(prevState, formData) {
  const title = formData.get("title");

  // Validation
  if (!title?.trim()) {
    return {
      success: false,
      error: "Title is required",
      fields: { title: "" },
    };
  }

  if (title.trim().length < 3) {
    return {
      success: false,
      error: "Title must be at least 3 characters",
      fields: { title: title },
    };
  }

  try {
    await connectDB();

    const todo = await Todo.create({
      title: title.trim(),
      completed: false,
    });

    revalidatePath("/todos");

    return {
      success: true,
      error: null,
      todo: JSON.parse(JSON.stringify(todo)),
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to create todo. Please try again.",
    };
  }
}
```

## `useActionState` with Field-Level Errors:

```jsx
// app/auth/register/RegisterForm.jsx
"use client";

import { useActionState } from "react";
import { registerUser } from "@/app/_actions/authActions";

const initialState = {
  success: false,
  errors: {},
  message: "",
};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {/* Global success/error message */}
      {state.message && (
        <div
          className={`p-4 rounded-lg text-sm ${
            state.success
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {state.message}
        </div>
      )}

      {/* Name field */}
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          defaultValue={state.fields?.name || ""}
          className={`w-full border rounded-lg px-4 py-2
                      focus:outline-none focus:ring-2
                      ${
                        state.errors?.name
                          ? "border-red-400 focus:ring-red-300"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
        />
        {state.errors?.name && (
          <p className="text-red-500 text-xs mt-1">{state.errors.name}</p>
        )}
      </div>

      {/* Email field */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          defaultValue={state.fields?.email || ""}
          className={`w-full border rounded-lg px-4 py-2
                      focus:outline-none focus:ring-2
                      ${
                        state.errors?.email
                          ? "border-red-400 focus:ring-red-300"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
        />
        {state.errors?.email && (
          <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>
        )}
      </div>

      {/* Password field */}
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          className={`w-full border rounded-lg px-4 py-2
                      focus:outline-none focus:ring-2
                      ${
                        state.errors?.password
                          ? "border-red-400 focus:ring-red-300"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
        />
        {state.errors?.password && (
          <p className="text-red-500 text-xs mt-1">{state.errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-500 text-white py-3
                   rounded-lg font-semibold hover:bg-blue-600
                   disabled:opacity-50 transition-colors"
      >
        {isPending ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}
```

---

# ✅ VIDEO 73: Basic Client-Side Form Validation (S11 Ep.4)

## Why Client-Side Validation?

```
Server-side only:
User fills form → Submits → Waits for server → Gets error
→ Poor user experience (slow feedback)

Client + Server:
User types → Instant feedback → Submits → Server validates again
→ Great UX + Secure (server is source of truth)

RULE: Always validate on BOTH sides!
```

## Validation Strategies:

```
1. onBlur  → Validate when field loses focus
2. onChange → Validate as user types (real-time)
3. onSubmit → Validate all fields before submit
```

## Complete Form Validation System:

```jsx
// app/auth/register/RegisterForm.jsx
"use client";

import { useState } from "react";

// Validation rules
const validators = {
  name: (value) => {
    if (!value.trim()) return "Name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    if (value.trim().length > 50) return "Name too long (max 50 characters)";
    return null;
  },

  email: (value) => {
    if (!value.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(value)) return "Enter a valid email address";
    return null;
  },

  password: (value) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(value))
      return "Must contain at least one uppercase letter";
    if (!/[0-9]/.test(value)) return "Must contain at least one number";
    return null;
  },

  confirmPassword: (value, formData) => {
    if (!value) return "Please confirm your password";
    if (value !== formData.password) return "Passwords do not match";
    return null;
  },
};

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  // Validate single field
  function validateField(name, value) {
    const validator = validators[name];
    if (!validator) return null;
    return validator(value, formData);
  }

  // Handle input change with real-time validation
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Only validate if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }

  // Handle blur — mark field as touched
  function handleBlur(e) {
    const { name, value } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }

  // Validate all fields on submit
  function validateAll() {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {}),
    );

    return isValid;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Run all validations
    if (!validateAll()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const serverErrors = {};
          data.errors.forEach((err) => {
            serverErrors.server = err;
          });
          setErrors(serverErrors);
        }
        return;
      }

      // Success!
      alert("Account created successfully!");
    } catch (err) {
      setErrors({ server: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  // Reusable field component
  function FormField({ name, label, type = "text", placeholder }) {
    const hasError = touched[name] && errors[name];

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full border rounded-lg px-4 py-2
                      focus:outline-none focus:ring-2 transition-colors
                      ${
                        hasError
                          ? "border-red-400 focus:ring-red-300 bg-red-50"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
        />
        {hasError && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            ⚠️ {errors[name]}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {errors.server && (
        <div
          className="bg-red-50 border border-red-200
                        text-red-700 p-4 rounded-lg text-sm"
        >
          {errors.server}
        </div>
      )}

      <FormField name="name" label="Full Name" placeholder="John Doe" />

      <FormField
        name="email"
        label="Email Address"
        type="email"
        placeholder="john@example.com"
      />

      <FormField
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
      />

      <FormField
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
      />

      {/* Password strength indicator */}
      {formData.password && <PasswordStrength password={formData.password} />}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-3 rounded-lg
                   font-semibold hover:bg-blue-600 disabled:opacity-50
                   transition-colors"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}

// Password strength component
function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Special character", pass: /[^A-Za-z0-9]/.test(password) },
  ];

  const passed = checks.filter((c) => c.pass).length;
  const strength =
    ["Weak", "Fair", "Good", "Strong"][passed - 1] || "Very Weak";
  const colors = ["red", "orange", "yellow", "green"];

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < passed ? `bg-${colors[passed - 1]}-500` : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Strength: <span className="font-medium">{strength}</span>
      </p>
      <ul className="space-y-1">
        {checks.map((check) => (
          <li
            key={check.label}
            className={`text-xs flex items-center gap-1 ${
              check.pass ? "text-green-600" : "text-gray-400"
            }`}
          >
            {check.pass ? "✅" : "○"} {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

# 🛡️ VIDEO 74: Form Validation with Zod in Next.js (S11 Ep.5)

## What is Zod?

> **Zod** is a TypeScript-first schema validation library. Define a schema once — use it for both frontend and backend validation.

```bash
npm install zod
```

## Why Zod?

```
Manual validation:                Zod validation:
if (!name) errors.push(...)  →   z.string().min(1)
if (name.length < 2) ...     →   .min(2, 'Too short')
if (!/regex/.test(email))    →   z.string().email()
→ Verbose, error-prone            → Declarative, type-safe
```

## Defining Schemas:

```js
// lib/validations.js
import { z } from 'zod';

// Register schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase(),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),

  confirmPassword: z.string().min(1, 'Please confirm your password')

}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }
);

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),

  password: z
    .string()
    .min(1, 'Password is required')
});

// Todo schema
export const todoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),

  priority: z
    .enum(['low', 'medium', 'high'])
    .optional()
    .default('medium')
});

// TypeScript types derived from schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TodoInput = z.infer<typeof todoSchema>;
```

## Using Zod in Server Actions:

```js
// app/_actions/authActions.js
"use server";

import { registerSchema, loginSchema } from "@/lib/validations";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/bcrypt";
import { redirect } from "next/navigation";

export async function registerUser(prevState, formData) {
  // Get raw data from form
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  // Validate with Zod
  const validationResult = registerSchema.safeParse(rawData);

  if (!validationResult.success) {
    // Format Zod errors into field-level errors object
    const fieldErrors = {};

    validationResult.error.errors.forEach((err) => {
      const field = err.path[0];
      if (!fieldErrors[field]) {
        fieldErrors[field] = err.message;
      }
    });

    return {
      success: false,
      errors: fieldErrors,
      fields: rawData, // Return fields to repopulate form
      message: "Please fix the errors below",
    };
  }

  const { name, email, password } = validationResult.data;

  try {
    await connectDB();

    // Check existing user
    const existing = await User.findOne({ email });

    if (existing) {
      return {
        success: false,
        errors: { email: "This email is already registered" },
        fields: rawData,
        message: "",
      };
    }

    const hashedPassword = await hashPassword(password);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      success: true,
      errors: {},
      message: "Account created! Redirecting to login...",
    };
  } catch (error) {
    return {
      success: false,
      errors: {},
      message: "Registration failed. Please try again.",
    };
  }
}
```

## Zod in Client Components (Real-time Validation):

```jsx
// app/auth/register/RegisterForm.jsx
"use client";

import { useState } from "react";
import { useActionState } from "react";
import { registerUser } from "@/app/_actions/authActions";
import { registerSchema } from "@/lib/validations";

const initialState = {
  success: false,
  errors: {},
  fields: {},
  message: "",
};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerUser,
    initialState,
  );

  const [clientErrors, setClientErrors] = useState({});

  // Real-time field validation using same Zod schema
  function validateField(name, value) {
    const fieldSchema = registerSchema.shape[name];
    if (!fieldSchema) return;

    const result = fieldSchema.safeParse(value);

    if (!result.success) {
      setClientErrors((prev) => ({
        ...prev,
        [name]: result.error.errors[0].message,
      }));
    } else {
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  // Merge server + client errors (server errors take priority)
  const allErrors = { ...clientErrors, ...state.errors };

  return (
    <form action={formAction} className="space-y-4">
      {state.message && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            state.success
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {state.message}
        </div>
      )}

      {[
        { name: "name", label: "Full Name", type: "text" },
        { name: "email", label: "Email", type: "email" },
        { name: "password", label: "Password", type: "password" },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          type: "password",
        },
      ].map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium mb-1">
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            defaultValue={state.fields?.[field.name] || ""}
            onBlur={(e) => validateField(field.name, e.target.value)}
            className={`w-full border rounded-lg px-4 py-2
                        focus:outline-none focus:ring-2 transition-all ${
                          allErrors[field.name]
                            ? "border-red-400 focus:ring-red-300"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
          />
          {allErrors[field.name] && (
            <p className="text-red-500 text-xs mt-1">
              ⚠️ {allErrors[field.name]}
            </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-500 text-white py-3 rounded-lg
                   font-semibold hover:bg-blue-600 disabled:opacity-50"
      >
        {isPending ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}
```

---

# 👤 VIDEO 75: User Registration with Server Actions (S11 Ep.6)

## Complete Registration Flow with Server Actions:

```js
// app/_actions/authActions.js
"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/bcrypt";
import { registerSchema } from "@/lib/validations";
import { redirect } from "next/navigation";

export async function registerUser(prevState, formData) {
  const rawData = Object.fromEntries(formData);

  // Zod validation
  const result = registerSchema.safeParse(rawData);

  if (!result.success) {
    const errors = {};
    result.error.errors.forEach((err) => {
      if (!errors[err.path[0]]) {
        errors[err.path[0]] = err.message;
      }
    });

    return {
      success: false,
      errors,
      fields: rawData,
    };
  }

  const { name, email, password } = result.data;

  try {
    await connectDB();

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return {
        success: false,
        errors: { email: "This email is already registered" },
        fields: rawData,
      };
    }

    const hashedPw = await hashPassword(password);

    await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPw,
    });
  } catch (error) {
    return {
      success: false,
      errors: { form: "Registration failed. Please try again." },
      fields: rawData,
    };
  }

  // Redirect OUTSIDE try/catch
  // (redirect throws internally — works correctly this way)
  redirect("/login?registered=true");
}
```

## Registration Page with Success Message:

```jsx
// app/(auth)/register/page.jsx
import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Create Account",
};

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-blue-50 to-indigo-100 px-4"
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-8
                      w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join us today — it's free!</p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-500 font-medium hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
```

---

# 🔑 VIDEO 76: User Login with Server Actions (S11 Ep.7)

## Login Server Action:

```js
// app/_actions/authActions.js (login part)
"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { comparePasswords } from "@/lib/bcrypt";
import { signToken } from "@/lib/jwt";
import { loginSchema } from "@/lib/validations";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(prevState, formData) {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  // Validate input
  const result = loginSchema.safeParse(rawData);

  if (!result.success) {
    const errors = {};
    result.error.errors.forEach((err) => {
      if (!errors[err.path[0]]) {
        errors[err.path[0]] = err.message;
      }
    });
    return { success: false, errors, fields: rawData };
  }

  const { email, password } = result.data;

  try {
    await connectDB();

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return {
        success: false,
        errors: { form: "Invalid email or password" },
        fields: rawData,
      };
    }

    const isValid = await comparePasswords(password, user.password);

    if (!isValid) {
      return {
        success: false,
        errors: { form: "Invalid email or password" },
        fields: rawData,
      };
    }

    // Create JWT
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  } catch (error) {
    return {
      success: false,
      errors: { form: "Login failed. Please try again." },
      fields: rawData,
    };
  }

  redirect("/dashboard");
}
```

## Login Form with useActionState:

```jsx
// app/(auth)/login/LoginForm.jsx
"use client";

import { useActionState } from "react";
import { loginUser } from "@/app/_actions/authActions";

const initialState = {
  success: false,
  errors: {},
  fields: {},
};

export default function LoginForm({ registered }) {
  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {/* Registration success message */}
      {registered && (
        <div
          className="bg-green-50 border border-green-200
                        text-green-700 p-4 rounded-lg text-sm"
        >
          ✅ Account created! Please sign in.
        </div>
      )}

      {/* Form-level error */}
      {state.errors?.form && (
        <div
          className="bg-red-50 border border-red-200
                        text-red-700 p-4 rounded-lg text-sm"
        >
          ❌ {state.errors.form}
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          defaultValue={state.fields?.email || ""}
          autoComplete="email"
          className={`w-full border rounded-lg px-4 py-3
                      focus:outline-none focus:ring-2 ${
                        state.errors?.email
                          ? "border-red-400 focus:ring-red-300"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
          placeholder="you@example.com"
        />
        {state.errors?.email && (
          <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          className={`w-full border rounded-lg px-4 py-3
                      focus:outline-none focus:ring-2 ${
                        state.errors?.password
                          ? "border-red-400 focus:ring-red-300"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
          placeholder="••••••••"
        />
        {state.errors?.password && (
          <p className="text-red-500 text-xs mt-1">{state.errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-3 rounded-lg
                   font-semibold hover:bg-blue-700 disabled:opacity-50
                   transition-colors"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
```

---

# 🔘 VIDEO 77: Using Server Actions without Forms (S11 Ep.8)

## Server Actions Beyond Forms

> Server Actions don't have to be used with forms — they can be called from **any event handler**!

```jsx
// app/_actions/todoActions.js
"use server";

import { connectDB } from "@/lib/db";
import Todo from "@/models/Todo";
import { revalidatePath } from "next/cache";

export async function toggleTodo(id, currentStatus) {
  await connectDB();
  await Todo.findByIdAndUpdate(id, { completed: !currentStatus });
  revalidatePath("/todos");
}

export async function deleteTodo(id) {
  await connectDB();
  await Todo.findByIdAndDelete(id);
  revalidatePath("/todos");
}

export async function updateTodoPriority(id, priority) {
  await connectDB();
  await Todo.findByIdAndUpdate(id, { priority });
  revalidatePath("/todos");
}
```

```jsx
// components/TodoItem.jsx
"use client";

import { useState, useTransition } from "react";
import {
  toggleTodo,
  deleteTodo,
  updateTodoPriority,
} from "@/app/_actions/todoActions";

export default function TodoItem({ todo }) {
  // useTransition for non-form Server Actions
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleTodo(todo._id, todo.completed);
    });
  }

  function handleDelete() {
    if (!confirm("Delete this todo?")) return;

    startTransition(async () => {
      await deleteTodo(todo._id);
    });
  }

  function handlePriorityChange(e) {
    startTransition(async () => {
      await updateTodoPriority(todo._id, e.target.value);
    });
  }

  return (
    <div
      className={`flex items-center gap-3 p-4 bg-white rounded-lg
                     border transition-opacity ${
                       isPending ? "opacity-50 pointer-events-none" : ""
                     }`}
    >
      {/* Toggle checkbox */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className="w-5 h-5 cursor-pointer"
      />

      {/* Title */}
      <span
        className={`flex-1 ${
          todo.completed ? "line-through text-gray-400" : ""
        }`}
      >
        {todo.title}
      </span>

      {/* Priority selector */}
      <select
        value={todo.priority || "medium"}
        onChange={handlePriorityChange}
        className="text-sm border rounded px-2 py-1"
      >
        <option value="low">🟢 Low</option>
        <option value="medium">🟡 Medium</option>
        <option value="high">🔴 High</option>
      </select>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="text-red-500 hover:text-red-700 transition-colors"
      >
        🗑️
      </button>

      {isPending && <span className="text-xs text-gray-400">Updating...</span>}
    </div>
  );
}
```

## `useTransition` vs `useActionState`:

```
useTransition:
→ For non-form Server Action calls
→ Wraps async calls in startTransition
→ isPending tells you if action is running
→ Does not manage return value

useActionState:
→ For form-based Server Actions
→ Manages form state (errors, data)
→ Works with progressive enhancement
→ Returns [state, formAction, isPending]
```

---

# 🔀 VIDEO 78: Next.js Middleware Explained in Depth (S12 Ep.1)

## What is Middleware?

> **Middleware** runs code **before** a request is completed. It can modify the response, redirect, rewrite, or add headers — all before the page renders.

```
Request → Middleware → Route Handler / Page
           ↑
    Runs code here (authentication, logging, etc.)
```

## Creating Middleware:

```js
// middleware.js — Must be in ROOT of project (next to app/)
import { NextResponse } from "next/server";

export function middleware(request) {
  // Runs before EVERY matching request
  console.log("Middleware running for:", request.url);

  return NextResponse.next(); // Continue to the route
}

// Configure which routes middleware runs on
export const config = {
  matcher: [
    // Match specific paths
    "/dashboard/:path*",
    "/api/todos/:path*",
    "/profile",
    // Exclude static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
```

## Authentication Middleware:

```js
// middleware.js
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/settings", "/todos"];

// Routes only accessible when NOT logged in
const authRoutes = ["/login", "/register"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authToken")?.value;

  // Check if user is authenticated
  const isAuthenticated = token ? !!verifyToken(token) : false;

  // Check route types
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
```

## Middleware Response Methods:

```js
// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  // 1. Continue to route (default)
  return NextResponse.next();

  // 2. Redirect to another URL
  return NextResponse.redirect(new URL("/login", request.url));

  // 3. Rewrite URL (change URL without redirect — user sees original URL)
  return NextResponse.rewrite(new URL("/dashboard", request.url));

  // 4. Return a response directly
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 5. Modify headers
  const response = NextResponse.next();
  response.headers.set("X-Custom-Header", "value");
  return response;

  // 6. Set/delete cookies
  const response = NextResponse.next();
  response.cookies.set("visited", "true");
  response.cookies.delete("oldCookie");
  return response;
}
```

## Adding Data to Request Headers (Pass to Pages):

```js
// middleware.js — Attach user info to headers
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function middleware(request) {
  const token = request.cookies.get("authToken")?.value;
  const requestHeaders = new Headers(request.headers);

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      // Pass user data via headers to server components
      requestHeaders.set("x-user-id", decoded.userId);
      requestHeaders.set("x-user-email", decoded.email);
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}
```

```jsx
// Reading in Server Component
import { headers } from "next/headers";

export default async function DashboardPage() {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  return <div>User ID: {userId}</div>;
}
```

---

# 🔄 VIDEO 79: Rewrite a Request using NextResponse (S12 Ep.2)

## What is URL Rewriting?

```
Redirect: User sees URL change in browser
/old-page → browser shows /new-page

Rewrite: User sees original URL, but different content served
/products → browser still shows /products
            BUT actually serves /products/v2 content
```

## Basic Rewrite:

```js
// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // A/B Testing — rewrite 50% of users to variant
  if (pathname === "/landing") {
    const showVariant = Math.random() > 0.5;

    if (showVariant) {
      return NextResponse.rewrite(new URL("/landing-b", request.url));
      // User sees /landing but gets /landing-b content
    }
  }

  return NextResponse.next();
}
```

## Practical Rewrite Examples:

```js
// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Geo-based routing
  const country = request.geo?.country || "US";

  if (pathname === "/" && country === "IN") {
    return NextResponse.rewrite(
      new URL("/in", request.url), // Indian version of home page
    );
  }

  // 2. API versioning
  if (pathname.startsWith("/api/")) {
    const apiVersion = request.headers.get("API-Version") || "v1";
    return NextResponse.rewrite(
      new URL(pathname.replace("/api/", `/api/${apiVersion}/`), request.url),
    );
  }

  // 3. Maintenance mode
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const isMaintenancePage = pathname === "/maintenance";

  if (isMaintenanceMode && !isMaintenancePage) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}
```

---

# ⚡ VIDEO 80: What is Edge Runtime in Next.js? (S12 Ep.3)

## What is Edge Runtime?

```
Two Runtimes in Next.js:

1. Node.js Runtime (Default):
   - Full Node.js API access
   - File system, all npm packages
   - Runs on traditional servers
   - Slower cold start

2. Edge Runtime:
   - Lightweight V8-based runtime
   - Runs GLOBALLY close to users (CDN edge)
   - Faster cold starts
   - Limited API (no fs, no native modules)
   - Uses Web Standard APIs only
```

## When to Use Edge Runtime:

```
✅ Use Edge Runtime for:
- Middleware (default in Next.js)
- Simple authentication checks
- Geolocation-based routing
- A/B testing
- Fast API responses

❌ Avoid Edge Runtime for:
- Database connections (MongoDB, Prisma)
- File system operations
- Heavy computation
- Native Node.js modules
```

## Setting Edge Runtime:

```js
// app/api/hello/route.js
export const runtime = "edge"; // Use Edge Runtime for this route

export async function GET() {
  return Response.json({
    message: "Hello from Edge!",
    region: process.env.VERCEL_REGION || "local",
  });
}
```

```js
// middleware.js — Already uses Edge Runtime by default!
export const config = {
  runtime: "edge", // This is default for middleware
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
```

## Edge Runtime API Limitations:

```js
// ✅ Available in Edge Runtime
fetch()
Request / Response
URL / URLSearchParams
Headers
crypto.subtle
TextEncoder / TextDecoder
ReadableStream / WritableStream

// ❌ NOT available in Edge Runtime
require()
fs (file system)
Buffer (use Uint8Array instead)
process.env (most vars) — some available
Native npm packages with binary dependencies
```

## Checking Runtime in Code:

```js
// app/api/runtime-check/route.js
export const runtime = "edge";

export async function GET() {
  const info = {
    runtime: "edge",
    timestamp: new Date().toISOString(),

    // Edge-specific features
    crypto: typeof crypto !== "undefined",
    fetch: typeof fetch !== "undefined",
  };

  return Response.json(info);
}
```

## Edge Runtime vs Node.js Comparison:

```
Feature          | Node.js Runtime | Edge Runtime
────────────────────────────────────────────────
Cold start       | Slower          | Very fast (~0ms)
Location         | Single region   | Global (near user)
Node.js APIs     | ✅ Full          | ❌ Limited
File system      | ✅ Yes          | ❌ No
npm packages     | ✅ All          | ⚠️ Web-compatible only
Database direct  | ✅ Yes          | ❌ No
Max size         | No limit        | 1MB (Vercel)
```

---

# 📝 SET 8 — Quick Revision Cheatsheet

```
┌──────────────────────────────────────────────────────────────┐
│                    NEXT.JS SET 8 SUMMARY                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SERVER ACTIONS IN CLIENT COMPONENTS:                        │
│  'use server' in separate file                               │
│  Import and call directly from Client Component              │
│  No fetch() needed!                                          │
│  Can pass args with .bind(null, arg1, arg2)                  │
│                                                              │
│  useActionState:                                             │
│  const [state, formAction, isPending] =                      │
│    useActionState(serverAction, initialState)                │
│  Action receives (prevState, formData)                       │
│  form action={formAction}                                    │
│                                                              │
│  ZOD VALIDATION:                                             │
│  npm install zod                                             │
│  z.object({ field: z.string().min(1) })                      │
│  schema.safeParse(data) → { success, error, data }           │
│  error.errors.forEach(e => fieldErrors[e.path[0]])           │
│  Share same schema between client + server!                  │
│                                                              │
│  SERVER ACTIONS WITHOUT FORMS:                               │
│  const [isPending, startTransition] = useTransition()        │
│  startTransition(async () => { await myAction(id) })         │
│                                                              │
│  MIDDLEWARE:                                                 │
│  middleware.js at project root                               │
│  export function middleware(request) { }                     │
│  export const config = { matcher: [...] }                    │
│  NextResponse.next()      → Continue                         │
│  NextResponse.redirect()  → Redirect                         │
│  NextResponse.rewrite()   → Rewrite (no URL change)          │
│                                                              │
│  URL REWRITING:                                              │
│  User sees original URL                                      │
│  Different content served silently                           │
│  Use cases: A/B testing, geo-routing, maintenance mode       │
│                                                              │
│  EDGE RUNTIME:                                               │
│  export const runtime = 'edge'                               │
│  Runs globally near users                                    │
│  Fast cold starts                                            │
│  No Node.js APIs, no DB connections                          │
│  Middleware uses Edge by default                             │
│                                                              │
│  KEY PATTERNS:                                               │
│  redirect() outside try/catch in Server Actions              │
│  revalidatePath('/path') after mutations                     │
│  Return fields with errors to repopulate form                │
│  Merge client + server errors for best UX                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```
