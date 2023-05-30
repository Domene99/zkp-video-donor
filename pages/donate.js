import { useState } from "react";
import { ethers } from "ethers";
import { abiDonor, addressDonor, addressProcessor } from "../constants.js";
import {
  Box,
  Input,
  FormControl,
  Button,
  FormLabel,
  Heading,
  VStack,
  StackDivider,
  Center,
} from "@chakra-ui/react";

function DonatePage({ web3, setWeb3, setOwnerAddress, ownerAddress }) {
  const [swearCount, setSwearCount] = useState(100);
  const [topicKeys, setTopicKeys] = useState(null);
  const [topicValues, setTopicValues] = useState(null);
  const [safetyScore, setSafetyScore] = useState(0);
  const [language, setLanguage] = useState("");
  const [amount, setAmount] = useState(0);
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

  return (
    <Box p={4} mx="150">
      <Heading>Donate Form</Heading>
      {web3 ? (
        <form onSubmit={handleSubmit} className="form">
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Maximum number of swear words?</FormLabel>
              <Input
                type="number"
                value={swearCount}
                onChange={handleSwearCountChange}
                placeholder="10"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>
                What topics does the video need to talk about?
              </FormLabel>
              <Input
                type="text"
                onChange={handleTopicKeysChange}
                placeholder='["technology", "science", "slavery"]'
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>
                What must be the sentiment of these topics (same order)?
              </FormLabel>
              <Input
                type="text"
                onChange={handleTopicValuesChange}
                placeholder='["positive", "positive", "negative"]'
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>
                What's the minimum brand safety score (0-100)?
              </FormLabel>
              <Input
                type="number"
                value={safetyScore}
                onChange={handleSafetyScoreChange}
                placeholder="50"
                min="0"
                max="100"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>What language should the video be in?</FormLabel>
              <Input
                type="text"
                value={language}
                onChange={handleLanguageChange}
                placeholder="English"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>How much do you wish to donate?</FormLabel>
              <Input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="15"
              />
            </FormControl>
            <Button type="submit" className="button">
              Donate
            </Button>
          </VStack>
        </form>
      ) : (
        <Center minH={"500px"}> Please connect to metamask</Center>
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
    </Box>
  );
}

export default DonatePage;
