export default async function File({ params }) {
  const { files } = await params;

  return (
    <h2>
      File Path: <code>/{files?.join("/")}</code>
    </h2>
  );
}
