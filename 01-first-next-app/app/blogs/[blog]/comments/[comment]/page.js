export async function generateMetadata({ params }) {
  const { comment } = await params;
  return {
    title: `${comment}`,
  };
}

export default async function Comment({ params }) {
  const { blog, comment } = await params;

  return (
    <h2>
      <p>
        <b>/{blog}</b>
      </p>
      Comment:
      <i>
        {" "}
        <b>{comment}</b>
      </i>
    </h2>
  );
}
