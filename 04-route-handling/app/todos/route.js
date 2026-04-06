import connectDB from "@/lib/connectDB";
import Todo from "@/models/todoModel";

// GET: Fetch all todos
export async function GET() {
  await connectDB();

  try {
    const todos = await Todo.find();
    return Response.json(todos);
  } catch (error) {
    return Response.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}

// POST: Create a new todo
export async function POST(request) {
  await connectDB();

  try {
    const { text } = await request.json();

    if (!text) {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    const newTodo = await Todo.create({
      text: text,
      completed: false,
    });

    return Response.json(newTodo, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to create todo" }, { status: 500 });
  }
}
