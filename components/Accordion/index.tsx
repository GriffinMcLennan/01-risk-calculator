import { Text, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Accordion = ({ title, children }: any) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Flex flexDirection="column" bg="secondary" borderRadius="10px">
            <Flex width="40vw" cursor="pointer" alignItems="center" onClick={() => setExpanded((b) => !b)}>
                {expanded ? <FaChevronUp color="#fff" /> : <FaChevronDown color="#fff" />}
                <Text variant="primary" ml="5px">
                    {title}
                </Text>
            </Flex>
            <Flex display={expanded ? "flex" : "none"} flexDirection="column">
                {children}
            </Flex>
        </Flex>
    );
};

export default Accordion;
