import { Text, Flex, useDisclosure, Collapse } from "@chakra-ui/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Accordion = ({ title, children }: any) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Flex
            flexDirection="column"
            bg="secondary"
            borderRadius="10px"
            margin="20px"
            minHeight="40px"
            width="min(90vw, 995px)"
            overflow="auto"
        >
            <Flex
                width="40vw"
                mt="20px"
                mb={isOpen ? "20px" : "0px"}
                // padding="20px"
                ml="20px"
                cursor="pointer"
                alignItems="center"
                onClick={onToggle}
            >
                {isOpen ? <FaChevronUp color="#fff" /> : <FaChevronDown color="#fff" />}
                <Text variant="primary" ml="15px" fontSize="20px">
                    {title}
                </Text>
            </Flex>

            <Flex paddingX="20px" paddingBottom="20px">
                <Collapse in={isOpen}>{children}</Collapse>
            </Flex>
        </Flex>
    );
};

export default Accordion;
