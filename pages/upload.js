import { useState } from "react";
import { ethers } from "ethers";
const { Configuration, OpenAIApi } = require("openai");
import { FaSpinner } from "react-icons/fa";
import { abiProcessor, addressProcessor, url, prompts } from "./constants.js";

class CustomFormData extends FormData {
  getHeaders() {
    return {};
  }
}

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  formDataCtor: CustomFormData,
});

const openai = new OpenAIApi(configuration);

export default function Upload() {
  const [web3, setWeb3] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState("");
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [txDone, setTxDone] = useState(false);

  const extractListFromString = (text) => {
    let res_list = [];
    const single_quote_no_spaces = "[('w+',?)+]";
    const single_quote_with_spaces = "[('w+',? )+('w+')]";
    const double_quote_no_spaces = '[("w+",?)+]';
    const double_quote_with_spaces = '[("w+",? )+("w+")]';

    if (
      text.search(single_quote_no_spaces) != -1 ||
      text.search(double_quote_no_spaces) != -1
    ) {
      res_list = text.substring(1, text.length - 1).split(",");
    }

    if (
      text.search(single_quote_with_spaces) != -1 ||
      text.search(double_quote_with_spaces) != -1
    ) {
      res_list = text.substring(1, text.length - 1).split(", ");
    }

    return res_list;
  };

  const getDataFromText = async (text) => {
    for (let i = 0; i < prompts.length; i++) {
      prompts[i] += text + '" chatgpt: ';
    }
    let topics = {};
    let res = {
      swears: 0,
      score: 100,
      langs: [],
      topicKeys: [],
      topicValues: [],
    };

    const completion_swear = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompts[0] }],
    });

    if (!isNaN(completion_swear.data.choices[0].message.content)) {
      res["swears"] = parseInt(
        completion_swear.data.choices[0].message.content
      );
    }

    const completion_topics = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompts[1] }],
    });
    topics = JSON.parse(completion_topics.data.choices[0].message.content);

    let keys = [];
    let values = [];
    for (const [key, value] of Object.entries(topics)) {
      keys.push(key);
      values.push(value);
    }
    res["topicKeys"] = keys;
    res["topicValues"] = values;

    const completion_langs = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompts[2] }],
    });

    res["langs"] = extractListFromString(
      completion_langs.data.choices[0].message.content
    );

    const completion_score = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompts[3] }],
    });

    if (!isNaN(completion_score.data.choices[0].message.content)) {
      res["score"] = parseInt(completion_score.data.choices[0].message.content);
    }

    return res;
  };

  const delay = (delayInms) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms));
  };

  const waitForProgress = async (url, options) => {
    options["method"] = "GET";
    do {
      let response = await fetch(
        `https://api.thetavideoapi.com/video/${url}`,
        options
      );
      var result = await response.json();
      await delay(1000);
      if (result.status == "error") {
        return;
      }
    } while (result.body.videos[0].player_uri == undefined);
    return {
      player: result.body.videos[0].player_uri,
      playback: result.body.videos[0].playback_uri,
    };
  };

  const presignUrl = async (options) => {
    const response = await fetch(
      "https://api.thetavideoapi.com/upload",
      options
    );
    const result = await response.json();
    return {
      id: result.body.uploads[0].id,
      presigned: result.body.uploads[0].presigned_url,
    };
  };

  const uploadFile = async (file, presigned) => {
    const response_upload = await fetch(presigned, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
    await response_upload;
  };

  const transcode = async (id) => {
    var options = {
      method: "POST",
      url: "https://api.thetavideoapi.com/video",
      headers: {
        "x-tva-sa-id": process.env.NEXT_PUBLIC_SA_ID,
        "x-tva-sa-secret": process.env.NEXT_PUBLIC_SA_SECRET,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_upload_id: `${id}`,
        playback_policy: "public",
      }),
    };
    const response_transcode = await fetch(
      "https://api.thetavideoapi.com/video",
      options
    );
    const result_transcode = await response_transcode.json();
    return result_transcode.body.videos[0].id;
  };

  const connectToMetamask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.log(error);
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      setWeb3(accounts);
      setOwnerAddress(accounts[0]);
    } else {
      alert("Please install MetaMask");
    }
  };

  const listenForTransactionMine = (transactionResponse, provider) => {
    return new Promise((resolve, reject) => {
      try {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
          setTxHash(transactionReceipt.transactionHash);
          setTxDone(true);
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const addVideo = async (features, uris, address) => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        addressProcessor,
        abiProcessor,
        signer
      );
      try {
        const transactionResponse = await contract.addVideo(
          address,
          uris["player"],
          uris["playback"],
          features["swears"],
          features["topicKeys"],
          features["topicValues"],
          features["score"],
          features["langs"]
        );
        const tx = await listenForTransactionMine(
          transactionResponse,
          provider
        );
        setVideoUploaded(true);
        return tx;
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please install metamask");
    }
  };

  const handleFileChange = async (event) => {
    setIsLoading(true);
    const file = event.target.files[0];

    // create a new FileReader object
    const reader = new FileReader();

    // wait for the file to be loaded
    await new Promise((resolve) => {
      reader.onload = resolve;
      reader.readAsArrayBuffer(file);
    });

    // create a new Blob object with the file data
    const blob = new Blob([reader.result], {
      type: "application/octet-stream",
    });

    if (file.type !== "video/mp4") {
      alert("Only MP4 files are allowed");
    } else {
      setVideoFile(file);
      // Connected to OpenAI
      const resp = await openai.createTranscription(file, "whisper-1");

      const text = resp.data.text;
      const extracted = await getDataFromText(text);

      const options = {
        method: "POST",
        headers: {
          "x-tva-sa-id": process.env.NEXT_PUBLIC_SA_ID,
          "x-tva-sa-secret": process.env.NEXT_PUBLIC_SA_SECRET,
        },
      };
      const source_upload = await presignUrl(options);
      await uploadFile(blob, source_upload["presigned"]);
      const video_url = await transcode(source_upload["id"]);
      const uris = await waitForProgress(video_url, options);

      const tx = addVideo(extracted, uris, ownerAddress);

      event.target.disabled = true;
    }
    setIsLoading(false);
  };

  return (
    <div className={"container"}>
      <h1 className={"title"}>Upload Video</h1>
      <div className={"topbar"}>
        {!web3 && (
          <button className={"metamaskButton"} onClick={connectToMetamask}>
            Connect to MetaMask
          </button>
        )}
      </div>
      {web3 && (
        <div className={"content"}>
          <label htmlFor="videoFile" className={"label"}>
            Choose a video file:
          </label>
          <input
            type="file"
            id="videoFile"
            name="videoFile"
            accept="video/mp4"
            onChange={handleFileChange}
            className={"input"}
          />
          {isLoading && <FaSpinner />}
          <div className="text">
            {txDone ? (
              <p>
                Finished with tx:
                <a
                  href={`https://testnet-explorer.thetatoken.org/txs/${txHash}`}
                >
                  {txHash}
                </a>
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
