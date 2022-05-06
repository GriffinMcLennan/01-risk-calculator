import { Flex, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
    return (
        <Flex backgroundColor="gray" height="100%" width="100vw">
            <Head>
                <title>01 Risk Calculator</title>
                <meta name="description" content="Calculate the risk of your account" /> {/* TODO */}
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Text>Hello</Text>
        </Flex>
    );
};

export default Home;
