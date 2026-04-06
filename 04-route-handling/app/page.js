"use client";

import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const { theme = "dark", setTheme } = useTheme();

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const response = await fetch("/todos");
    const todoData = await response.json();
    setTodos(todoData.reverse());
  }

  // Add new todo
  const addTodo = async (text) => {
    if (!text.trim()) return;

    const response = await fetch("/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const newTodo = await response.json();
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  };

  // Delete todo
  const deleteTodo = async (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => id !== todo._id));

    const response = await fetch(`/todos/${id}`, {
      method: "DELETE",
    });

    if (response.status === 204) {
      fetchTodos();
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id) => {
    const todoToToggle = todos.find((todo) => todo._id === id);
    if (!todoToToggle) return;

    const response = await fetch(`/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !todoToToggle.completed }),
    });

    if (!response.ok) {
      console.error("Failed to toggle todo", await response.text());
      return;
    }

    const updatedTodo = await response.json();
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo._id === id ? updatedTodo : todo)),
    );
  };

  // Update todo text
  const updateTodo = async (id, newText) => {
    if (!newText.trim()) return;

    const response = await fetch(`/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newText }),
    });

    if (!response.ok) {
      console.error("Failed to update todo", await response.text());
      return;
    }

    const updatedTodo = await response.json();
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo._id === id ? updatedTodo : todo)),
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-lg">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Todo App
          </h1>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
        </header>

        <TodoForm addTodo={addTodo} />

        <main className="mt-6">
          <TodoList
            todos={todos}
            deleteTodo={deleteTodo}
            toggleTodo={toggleTodo}
            updateTodo={updateTodo}
          />
        </main>
      </div>
    </div>
  );
}
