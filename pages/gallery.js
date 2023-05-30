import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { abiProcessor, addressProcessor, url, prompts } from "../constants.js";

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

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const limitContent = (content) => {
    if (content.length <= 100 || expanded) {
      return content;
    }
    return content.substring(0, 100) + "...";
  };

  return (
    <div data-vjs-player>
      <video ref={videoNode} className="video-js"></video>
      <div className="video-description">
        <p>{limitContent(props.description)}</p>
        {props.description.length > 100 && (
          <button onClick={handleExpand}>
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
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
    fetchVideos();
  }, [startIndex]);

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
    let text = "Donors:\n";
    for (let i = 0; i < video.donors.length; i++) {
      text += video.donors[i] + ",\n";
    }
    return text;
  };

  return (
    <div>
      <h1>Video Gallery</h1>
      <div className="video-grid">
        {videos.map((video, index) => (
          <div key={index} className="video-item">
            <Video {...play(video)} description={sponsors(video)} />
            <p>{sponsors(video)}</p>
          </div>
        ))}
      </div>
      <button
        className="next-button"
        onClick={handleNext}
        disabled={!hasMoreVideos}
      >
        Next
      </button>
    </div>
  );
}
