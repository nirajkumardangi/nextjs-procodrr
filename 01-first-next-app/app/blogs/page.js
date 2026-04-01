import Link from "next/link";

export const metadata = {
  title: "Blogs",
};

export default function Blogs() {
  return (
    <>
      <h2>All Blogs</h2>
      <ul>
        <li>
          <Link href="blogs/1">Blog 1</Link>
        </li>
        <li>
          <Link href="blogs/2">Blog 2</Link>
        </li>
        <li>
          <Link href="blogs/3">Blog 3</Link>
        </li>
        <li>
          <Link href="blogs/4">Blog 4</Link>
        </li>
        <li>
          <Link href="blogs/5">Blog 5</Link>
        </li>
      </ul>
    </>
  );
}
