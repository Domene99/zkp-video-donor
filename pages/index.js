import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  function handleUploadClick() {
    router.push("/upload");
  }

  function handleDonateClick() {
    router.push("/donate");
  }

  return (
    <div>
      <h1>Welcome to my website</h1>
      <p>Click on the button below to go to the upload page:</p>
      <button onClick={handleUploadClick}>Upload</button>
      <p>Click on the button below to go to the donate page:</p>
      <button onClick={handleDonateClick}>Donate</button>
    </div>
  );
}
