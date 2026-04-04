import { writeFile } from "fs/promises";
import todosData from "../../todos.json";

// GET: Fetch all todos
export function GET() {
  return Response.json(todosData);
}

// POST: Create a new todo
export async function POST(request) {
  const todo = await request.json();

  const newTodo = {
    id: crypto.randomUUID(),
    text: todo.text,
    completed: false,
  };

  todosData.push(newTodo);

  await writeFile("todos.json", JSON.stringify(todosData, null, 2));

  return Response.json(todosData);
}
