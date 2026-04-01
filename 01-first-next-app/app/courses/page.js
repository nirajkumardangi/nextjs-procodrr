import Link from "next/link";

// Force dynamic rendering for this page on every request
export const dynamic = "force-dynamic";

export default function Courses() {
  return (
    <>
      <h1>List of all courses</h1>
      <ol>
        <li>
          <Link href="courses/mern">MERN</Link>
        </li>
        <li>
          <Link href="courses/nodejs">Node.js</Link>
        </li>
        <li>
          <Link href="courses/nextjs">Next.js</Link>
        </li>
      </ol>
    </>
  );
}
