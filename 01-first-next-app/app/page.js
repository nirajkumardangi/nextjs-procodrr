import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1>Welcome My First Next App</h1>
      <ul>
        <li>
          <Link href="">Home</Link>
        </li>
        <li>
          <Link href="about">About</Link>
        </li>
        <li>
          <Link href="contacts">Contacts</Link>
        </li>
        <li>
          <Link href="courses">Courses</Link>
        </li>
      </ul>
    </>
  );
}
