// Generate metadata for the page title based on the blog parameter
export async function generateMetadata({ params }) {
  const { blog } = await params;
  return {
    title: `${blog}`,
  };
}

// Pre-generate static pages for these blog IDs at build time
export function generateStaticParams() {
  return [
    { blog: "1" },
    { blog: "2" },
    { blog: "3" },
    { blog: "4" },
    { blog: "5" },
  ];
}

// Main blog page component - renders the blog post based on the dynamic [blog] parameter
export default async function blog({ params, searchParams }) {
  const { blog } = await params;
  console.log(blog);
  return <h2>Blog Name: {blog}</h2>;
}
