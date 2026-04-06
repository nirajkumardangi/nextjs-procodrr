import connectDB from "@/lib/connectDB";
import Todo from "@/models/todoModel";

// GET: Fetch a single todo by ID
export async function GET(_, { params }) {
  await connectDB();

  const { id } = params;

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return Response.json({ error: "Todo not found!" }, { status: 404 });
    }

    return Response.json(todo);
  } catch (error) {
    return Response.json({ error: "Invalid ID format" }, { status: 400 });
  }
}

// PUT: Update a todo by ID
export async function PUT(request, { params }) {
  await connectDB();

  const { id } = params;
  const editTodoData = await request.json();

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(id, editTodoData, {
      new: true,
    });

    if (!updatedTodo) {
      return Response.json({ error: "Todo not found!" }, { status: 404 });
    }

    return Response.json(updatedTodo);
  } catch (error) {
    return Response.json({ error: "Invalid ID format" }, { status: 400 });
  }
}

// DELETE: Remove a todo by ID
export async function DELETE(_, { params }) {
  await connectDB();

  const { id } = params;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return Response.json({ error: "Todo not found!" }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return Response.json({ error: "Invalid ID format" }, { status: 400 });
  }
}
