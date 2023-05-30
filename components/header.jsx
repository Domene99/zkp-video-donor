import {
  Center,
  Flex,
  Button,
  Spacer,
  chakra,
  Heading,
  Tooltip,
  HStack,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";

import React from "react";

import truncateEthAddress from "truncate-eth-address";

const Links = ["Home", "Donate", "Upload"];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={`/${children.toLowerCase()}`}
  >
    {children}
  </Link>
);

export default function Header({
  web3,
  setWeb3,
  setOwnerAddress,
  ownerAddress,
}) {
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

  return (
    <chakra.header id="header">
      <Flex
        h="80px"
        w="100%"
        px="150"
        py="5"
        align="right"
        justify="space-between"
      >
        <Center>
          <Heading as="h4" size="md">
            zkp video donor
          </Heading>
        </Center>
        <Spacer />
        <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
          {Links.map((link) => (
            <NavLink key={link}>{link}</NavLink>
          ))}
        </HStack>
        <Spacer />
        {!web3 ? (
          <Button colorScheme="accent" onClick={connectToMetamask}>
            Connect To Metamask
          </Button>
        ) : (
          <Center>
            <Tooltip label={ownerAddress}>
              <Heading as="h4" size="md">
                {truncateEthAddress(ownerAddress)}
              </Heading>
            </Tooltip>
          </Center>
        )}
      </Flex>
    </chakra.header>
  );
}
