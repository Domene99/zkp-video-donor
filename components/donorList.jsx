import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Stack,
  StackDivider,
  Tooltip,
} from "@chakra-ui/react";
import truncateEthAddress from "truncate-eth-address";

export function DonorList({ donors }) {
  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              Donors
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel>
          <Stack divider={<StackDivider borderColor="gray.200" />}>
            {donors.map((donor) => (
              <>{donor}</>
            ))}
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
