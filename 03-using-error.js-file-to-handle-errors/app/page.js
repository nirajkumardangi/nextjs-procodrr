import Image from "next/image";

const Home = () => {
  return (
    <>
      <div>
        <h1>Home Page</h1>
        <p>Welcome to our website!</p>
        <Image
          src="/photo.jpg"
          width={600}
          height={400}
          alt="Description"
          // unoptimized='true'
          quality={100}
        />
      </div>
    </>
  );
};

export default Home;
