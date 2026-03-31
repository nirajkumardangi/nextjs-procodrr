export default async function blog({ params, searchParams }) {
  const { blog } = await params;
  return <h3>Blog Name: {blog}</h3>;
}
