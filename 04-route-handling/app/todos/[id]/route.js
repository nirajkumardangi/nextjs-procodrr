import { writeFile } from "fs/promises";
import todos from "../../../todos.json";
import connectDB from "@/lib/connectDB";
import mongoose from "mongoose";

// GET: Fetch a single todo by ID
export async function GET(_, { params }) {
  await connectDB();

  const result = await mongoose.connection.db
    .collection("todos")
    .insertOne({ title: "Leran HTML" });
  console.log(result);

  const { id } = await params;
  const todo = todos.find((todo) => id === todo.id);

  if (!todo) {
    return Response.json(
      { error: "Todo not found!" },
      {
        status: 404,
      },
    );
  }

  return Response.json(todo);
}

// PUT: Update a todo by ID
export async function PUT(request, { params }) {
  const editTodoData = await request.json();
  const { id } = await params;
  const todoIndex = todos.findIndex((todo) => id === todo.id);
  const todo = todos[todoIndex];

  if (!todo) {
    return Response.json(
      { error: "Todo not found!" },
      {
        status: 404,
      },
    );
  }

  const editedTodo = { ...todo, ...editTodoData };
  todos[todoIndex] = editedTodo;

  await writeFile("todos.json", JSON.stringify(todos, null, 2));
  return Response.json(editedTodo);
}

// DELETE: Remove a todo by ID
export async function DELETE(_, { params }) {
  const { id } = await params;
  const todoIndex = todos.findIndex((todo) => id === todo.id);

  if (todoIndex === -1) {
    return Response.json(
      { error: "Todo not found!" },
      {
        status: 404,
      },
    );
  }

  todos.splice(todoIndex, 1);
  await writeFile("todos.json", JSON.stringify(todos, null, 2));
  return new Response(null, {
    status: 204,
  });
}
