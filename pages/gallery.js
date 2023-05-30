import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { abiProcessor, addressProcessor, url, prompts } from "../constants.js";
import {
  Box,
  Heading,
  Center,
  Button,
  Card,
  CardBody,
  Stack,
} from "@chakra-ui/react";
import { DonorList } from "@/components/donorList.jsx";

const Video = (props) => {
  const videoNode = useRef(null);
  const [player, setPlayer] = useState(null);
  const [expanded, setExpanded] = useState(false); // Track expanded content

  useEffect(() => {
    if (videoNode.current) {
      const _player = videojs(videoNode.current, props);
      setPlayer(_player);
      return () => {
        if (player !== null) {
          player.dispose();
        }
      };
    }
  }, []);

  return (
    <div data-vjs-player>
      <video ref={videoNode} className="video-js"></video>
    </div>
  );
};

export default function Gallery({
  web3,
  setWeb3,
  setOwnerAddress,
  ownerAddress,
}) {
  const [videos, setVideos] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [hasMoreVideos, setHasMoreVideos] = useState(false);
  const numElements = 20;

  // Fetch video data from the smart contract
  const fetchVideos = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      addressProcessor,
      abiProcessor,
      signer
    );
    const videoCount = await contract.getVideoCount();
    const response = await contract.getProcessedVideos(startIndex, numElements);
    setVideos(response);
    setHasMoreVideos(startIndex + numElements < videoCount);
    return response;
  };

  // Fetch videos when the component mounts or startIndex changes
  useEffect(() => {
    if (web3) {
      fetchVideos();
    }
  }, [startIndex, web3]);

  useEffect(() => {
    console.log(videos);
  }, [videos]);

  const handleNext = () => {
    setStartIndex(startIndex + numElements);
  };

  const play = (vid) => {
    return {
      fill: true,
      fluid: true,
      autoplay: true,
      controls: true,
      preload: "metadata",
      sources: [
        {
          src: vid.playback_uri,
          type: "application/x-mpegURL",
        },
      ],
    };
  };

  const sponsors = (video) => {
    let text = "";
    for (let i = 0; i < video.donors.length; i++) {
      text += video.donors[i] + "\n";
    }
    return text;
  };

  return (
    <Box p={4} mx="150">
      {web3 ? (
        <>
          <Heading>Upload Video</Heading>
          <br />
          <Stack spacing="40px">
            {videos.map((video, index) => (
              <Card
                direction={{ base: "column", sm: "row" }}
                overflow="hidden"
                variant="outline"
              >
                <Center w={{ base: "20%", sm: "20%" }}>
                  <Video {...play(video)} description={sponsors(video)} />
                </Center>
                <CardBody>
                  <Heading size="md" textTransform="uppercase">
                    Video Title
                  </Heading>
                  <br />
                  <Stack spacing="3">
                    {video.donors.length > 0 ? (
                      <DonorList donors={video.donors} />
                    ) : (
                      <>There are no donors yet</>
                    )}
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </Stack>
          {videos.length > 9 && (
            <Button
              className="next-button"
              onClick={handleNext}
              disabled={!hasMoreVideos}
            >
              Next
            </Button>
          )}
        </>
      ) : (
        <Center minH={"500px"}> Please connect to metamask</Center>
      )}
    </Box>
  );
}
