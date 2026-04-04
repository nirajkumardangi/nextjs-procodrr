import { writeFile } from "fs/promises";
import todos from "../../../todos.json";


export async function GET(_, { params }) {
  const { id } = await params;

  const todo = todos.find((todo) => id === todo.id.toString());

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

export async function PUT(request, { params }) {
  const editTodoData = await request.json();
  const { id } = await params;
  const todoIndex = todos.findIndex((todo) => id === todo.id);
  const todo = todos[todoIndex];

  const editedTodo = {...todo, ...editTodoData};
  todos[todoIndex] = editedTodo;

  await writeFile("todos.json", JSON.stringify(todos, null, 2));
  return Response.json(editedTodo);
}
