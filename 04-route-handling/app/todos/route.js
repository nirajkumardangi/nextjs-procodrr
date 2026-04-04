import { writeFile } from "fs/promises";
import todosData from "../../todos.json";

export function GET() {
  return Response.json(todosData);
}

export async function POST(request) {
  const todo = await request.json();

  const newTodo = {
    id: crypto.randomUUID(),
    title: todo.title,
    completed: false,
  };

  todosData.push(newTodo);

  await writeFile("todos.json", JSON.stringify(todosData, null, 2));

  return Response.json(todosData);
}
