import { extendTheme } from "@chakra-ui/react";
import { TextStyles as Text } from "./components/ButtonStyles";

export const darkTheme = extendTheme({
    colors: {
        primary: "#121212",
        secondary: "rgba(255, 255, 255, 0.06)",
        tertiary: "rgba(255, 255, 255, 0.2)",
    },

    textColors: {
        primary: "#fff",
        secondary: "rgba(255, 255, 255, 0.7)",
        disabled: "rgba(255, 255, 255, 0.5)",
    },

    components: {
        Text,
    },
});
