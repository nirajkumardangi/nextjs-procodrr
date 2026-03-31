export default async function Comment({ params }) {
  const { blog, comment } = await params;

  return (
    <div>
      Comment id{" "}
      <i>
        <b>{comment}</b>
      </i>{" "}
      on <b>{blog}</b> page
    </div>
  );
}
