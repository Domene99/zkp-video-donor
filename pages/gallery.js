import React, { useState, useRef, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
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
  Divider,
  Grid,
  Text,
} from "@chakra-ui/react";
import { VideoCardFooter } from "../components/videoCardFooter";
const Video = (props) => {
  const videoNode = useRef(null);
  const [player, setPlayer] = useState(null);

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
}) {
  const [videos, setVideos] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [hasMoreVideos, setHasMoreVideos] = useState(false);
  const numElements = 20;

  function getColor(score) {
    if (score <= 40) {
      return "red.400";
    } else if (score <= 80) {
      return "orange.400";
    } else {
      return "green.400";
    }
  }

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
      autoplay: false,
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
          <Heading>Gallery</Heading>
          <br />
          <Stack spacing="40px">
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              {videos.map((video, index) => (
                <Card w="100%">
                  <Heading size="md" px={5} py={3}>
                    {video.title}
                  </Heading>
                  <Center>
                    <Video {...play(video)} description={sponsors(video)} />
                  </Center>
                  <CardBody>
                    <Text>Safety Score:</Text>
                    <Heading
                      size="xl"
                      textTransform="uppercase"
                      color={getColor(video.safety_score)}
                    >
                      {BigNumber.from(video.safety_score).toString()}
                    </Heading>
                  </CardBody>

                  <Divider />
                  <VideoCardFooter
                    languages={video.languages}
                    donors={video.donors}
                    topics={[video.topicKeys, video.topicValues]}
                  />
                </Card>
              ))}
            </Grid>
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
