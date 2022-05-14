export const TextStyles = {
    baseStyle: {
        fontSize: "16px",
    },
    // styles for different sizes ("sm", "md", "lg")
    sizes: {},
    // styles for different visual variants ("outline", "solid")
    variants: {
        primary: {
            color: "rgba(255, 255, 255, 0.9)",
        },
        secondary: {
            color: "rgba(255, 255, 255, 0.7)",
        },
        disabled: {
            color: "rgba(255, 255, 255, 0.5)",
        },
    },

    // default values for `size` and `variant`
    defaultProps: {
        size: "",
        variant: "",
    },
};
