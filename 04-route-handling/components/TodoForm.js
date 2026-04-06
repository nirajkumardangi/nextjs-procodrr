"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

const TodoForm = ({ addTodo }) => {
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedText = input.trim();
    if (!trimmedText) return;

    addTodo(trimmedText);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a new task..."
        className="w-full p-3 pr-12 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
      />
      <button
        type="submit"
        disabled={!input.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        aria-label="Add todo"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </form>
  );
};

export default TodoForm;
