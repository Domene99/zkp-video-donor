import { useState } from "react";
import "@/styles/globals.css";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Header from "@/components/header";

const theme = extendTheme({
  colors: {
    text: {
      100: "#041011",
    },
    background: {
      100: "#ffffff",
    },
    primary: {
      100: "#2b70c5",
    },
    secondary: {
      500: "#dfe1e0",
    },
    accent: {
      50: "#DFC368",
      500: "#D4AF37",
      900: "#655210",
    },
  },
});

export default function App({ Component, pageProps }) {
  const [web3, setWeb3] = useState(null);
  const [ownerAddress, setOwnerAddress] = useState("");
  const web3Props = { web3, setWeb3, setOwnerAddress, ownerAddress };
  return (
    <ChakraProvider theme={theme}>
      <Header {...web3Props} />
      <Component {...pageProps} {...web3Props} />
    </ChakraProvider>
  );
}
