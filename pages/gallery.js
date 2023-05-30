import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { abiProcessor, addressProcessor, url, prompts } from "../constants.js";
import {
  Box,
  SimpleGrid,
  Heading,
  Center,
  Button,
  Card,
  CardBody,
  Stack,
  Tooltip,
} from "@chakra-ui/react";
import truncateEthAddress from "truncate-eth-address";

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
          <SimpleGrid columns={[2, null, 3]} spacing="40px">
            {videos.map((video, index) => (
              <Card>
                <CardBody>
                  <Video {...play(video)} description={sponsors(video)} />

                  <Stack mt="6" spacing="3">
                    <Heading size="xs" textTransform="uppercase">
                      Donors:
                    </Heading>
                    {video.donors.map((donor, index) => (
                      <Tooltip label={donor}>
                        <Center
                          key={index}
                          bg="gray.100"
                          px="4"
                          py="1"
                          rounded="md"
                        >
                          {truncateEthAddress(donor)}
                        </Center>
                      </Tooltip>
                    ))}
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
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
