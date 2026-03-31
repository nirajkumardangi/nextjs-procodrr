export async function generateMetadata({ params }) {
  const { blog } = await params;
  return {
    title: `${blog}`,
  };
}

export default async function blog({ params, searchParams }) {
  const { blog } = await params;
  return <h2>Blog Name: {blog}</h2>;
}
