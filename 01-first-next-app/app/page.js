import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Welcome My First Next App</h1>
      <ul>
        <li className="text-blue-700">
          <Link href="">Home</Link>
        </li>
        <li className="text-blue-700">
          <Link href="blogs">Blogs</Link>
        </li>
        <li className="text-blue-700">
          <Link href="todo">Todos</Link>
        </li>
        <li className="text-blue-700">
          <Link href="about">About</Link>
        </li>
        <li className="text-blue-700">
          <Link href="contacts">Contacts</Link>
        </li>
        <li className="text-blue-700">
          <Link href="courses">Courses</Link>
        </li>
      </ul>
    </>
  );
}
