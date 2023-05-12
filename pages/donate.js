import { useState } from "react";
import { ethers } from "ethers";
import { abiDonor, addressDonor, addressProcessor } from "./constants.js";

function DonatePage() {
  const [swearCount, setSwearCount] = useState(100);
  const [topicKeys, setTopicKeys] = useState(null);
  const [topicValues, setTopicValues] = useState(null);
  const [safetyScore, setSafetyScore] = useState(0);
  const [language, setLanguage] = useState("");
  const [amount, setAmount] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [txHash, setTxHash] = useState("");
  const [txDone, setTxDone] = useState("");

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

    for (let i = 0; i < res_list.length; i++) {
      res_list[i] = res_list[i].substring(1, res_list[i].length - 1);
    }
    return res_list;
  };

  function handleSwearCountChange(e) {
    setSwearCount(e.target.value);
  }

  function handleTopicKeysChange(e) {
    setTopicKeys(extractListFromString(e.target.value));
  }

  function handleTopicValuesChange(e) {
    setTopicValues(extractListFromString(e.target.value));
  }

  function handleSafetyScoreChange(e) {
    setSafetyScore(e.target.value);
  }

  function handleLanguageChange(e) {
    setLanguage(e.target.value);
  }

  function handleAmountChange(e) {
    setAmount(e.target.value);
  }

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

  const donateToVideo = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(addressDonor, abiDonor, signer);
      try {
        const transactionResponse = await contract.donate(
          addressProcessor,
          swearCount,
          safetyScore,
          language,
          topicKeys,
          topicValues,
          { value: ethers.utils.parseEther(amount) }
        );
        const tx = await listenForTransactionMine(
          transactionResponse,
          provider
        );
        return tx;
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please install metamask");
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    const tx_hash = donateToVideo();
  }

  const connectToMetamask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.log(error);
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      setWeb3(accounts);
    } else {
      alert("Please install MetaMask");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Donate Form</h1>
      <div className={"topbar"}>
        {!web3 && (
          <button className={"metamaskButton"} onClick={connectToMetamask}>
            Connect to MetaMask
          </button>
        )}
      </div>
      {web3 && (
        <form onSubmit={handleSubmit} className="form">
          <label>
            What's the maximum number of swear words?
            <input
              type="number"
              value={swearCount}
              onChange={handleSwearCountChange}
              placeholder="10"
              className="input"
            />
          </label>
          <br />
          <label>
            What topics does the video need to talk about?
            <input
              type="text"
              // value={topicKeys}
              onChange={handleTopicKeysChange}
              placeholder='["technology", "science", "slavery"]'
              className="input"
            />
          </label>
          <br />
          <label>
            What must be the sentiment of these topics (same order)?
            <input
              type="text"
              // value={topicValues}
              onChange={handleTopicValuesChange}
              placeholder='["positive", "positive", "negative"]'
              className="input"
            />
          </label>
          <br />
          <label>
            What's the minimum brand safety score (0-100)?
            <input
              type="number"
              value={safetyScore}
              onChange={handleSafetyScoreChange}
              placeholder="50"
              className="input"
              min="0"
              max="100"
            />
          </label>
          <br />
          <label>
            What language should the video be in?
            <input
              type="text"
              value={language}
              onChange={handleLanguageChange}
              placeholder="English"
              className="input"
            />
          </label>
          <br />
          <label>
            How much do you wish to donate?
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="15"
              className="input"
            />
          </label>
          <br />
          <button type="submit" className="button">
            Donate
          </button>
        </form>
      )}
      <div className="text">
        {txDone ? (
          <p>
            Finished with tx:
            <a href={`https://testnet-explorer.thetatoken.org/txs/${txHash}`}>
              {txHash}
            </a>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default DonatePage;
