import { useRouter } from "next/router";

import { Box } from "@chakra-ui/react";

export default function Home() {
  const router = useRouter();

  function handleUploadClick() {
    router.push("/upload");
  }

  function handleDonateClick() {
    router.push("/donate");
  }

  function handleGalleryClick() {
    router.push("/gallery");
  }

  return (
    <Box bg="tomato" p={4} mx="150" color="white">
      <div>
        <h1>Welcome to my website</h1>
        <p>Click on the button below to go to the upload page:</p>
        <button onClick={handleUploadClick}>Upload</button>
        <p>Click on the button below to go to the donate page:</p>
        <button onClick={handleDonateClick}>Donate</button>
      </div>
    </Box>
  );
}
