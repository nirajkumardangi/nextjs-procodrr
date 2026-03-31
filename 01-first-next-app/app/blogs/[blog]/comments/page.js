export default async function Comments({ params }) {
  const { blog } = await params;
  return (
    <h2>
      All Comments on <i>{blog}</i> blog
    </h2>
  );
}
