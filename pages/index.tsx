import { Flex, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import RiskCalculator from "../components/RiskCalculator";

const Home: NextPage = () => {
    return (
        <Flex
            backgroundColor="primary"
            height="100vh"
            width="100vw"
            flexDirection="column"
            alignItems="center"
            overflowX="hidden"
        >
            <Head>
                <title>01 Risk Calculator</title>
                <meta name="description" content="Calculate the theoretical risk of your account" /> {/* TODO */}
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <RiskCalculator />
        </Flex>
    );
};

export default Home;
