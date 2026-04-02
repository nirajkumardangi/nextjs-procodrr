import TodoCard from "@/components/TodoCard";

export default async function Todo() {
  // // call this all slow api to test shimmer loadind effect
  // const slowResponse1 = await fetch("https://procodrr.vercel.app/?sleep=2000");
  // const slowResponse2 = await fetch("https://procodrr.vercel.app/?sleep=3000");

  // // call todos api on server
  // const response = await fetch(
  //   "https://jsonplaceholder.typicode.com/todos?_limit=10",
  // );
  // const todos = await response.json();

  // helper to fetch any URL and parse JSON
  async function fetchAll(url) {
    const response = await fetch(url);
    return await response.json();
  }

  // Example parallel fetch list (disabled; kept for reference)
  // const urls = [
  //   fetchAll("https://jsonplaceholder.typicode.com/todos?_limit=10"),
  //   fetchAll("https://procodrr.vercel.app/?sleep=2000"),
  //   fetchAll("https://procodrr.vercel.app/?sleep=3000"),
  // ];

  // parallel data fetching; included delays simulate slow API for shimmer demo
  const [todos, data1, data2] = await Promise.all([
    fetchAll("https://jsonplaceholder.typicode.com/todos?_limit=10"),
    fetchAll("https://procodrr.vercel.app/?sleep=2000"),
    fetchAll("https://procodrr.vercel.app/?sleep=3000"),
  ]);

  // data1/data2 are only for loading demonstration, not rendered here.

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
