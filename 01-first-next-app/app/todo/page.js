import TodoCard from "@/components/TodoCard";

export default async function Todo() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/todos?_limit=10",
    {
      next: {
        revalidate: 5000,
      },
    },
  );
  const todos = await response.json();
  console.log("Server side log");
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">All Todo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}
