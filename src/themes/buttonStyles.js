import designTokens from "../tokens/design-tokens";

/**
 * Common button styles.
 */
const commonButtonStyles = {
    textDecoration: "none",
    fontFamily: "Lato",
    fontWeight: 600,
    letterSpacing: 0,
    paragraphIndent: 0,
    paragraphSpacing: 0,
    textTransform: "none",
    borderRadius: 24,
};

/**
 * Function to generate button styles based on size and icon presence.
 *
 * @param {string} size - The size of the button ('small', 'medium', 'large').
 * @param {number} fontSize - The font size of the button.
 * @param {boolean} hasStartIcon - Indicates if the button has a start icon.
 * @param {boolean} hasEndIcon - Indicates if the button has an end icon.
 * @returns {object} - The generated styles for the button.
 */
const generateButtonStyles = (size, fontSize, hasStartIcon, hasEndIcon) => {
    let paddingLeft = 16;
    let paddingRight = 16;
    let paddingTop = 6;
    let paddingBottom = 6;
    let fontWeight = size === "small" ? 400 : 600;

    if (hasStartIcon) {
        switch (size) {
            case "large":
                paddingLeft = 16;
                break;
            case "medium":
                paddingLeft = 12;
                break;
            case "small":
                paddingLeft = 8;
                paddingTop = paddingBottom = 0;
                break;
            default:
                break;
        }
    }

    if (hasEndIcon) {
        switch (size) {
            case "large":
                paddingRight = 16;
                break;
            case "medium":
                paddingRight = 12;
                break;
            case "small":
                paddingRight = 8;
                paddingTop = paddingBottom = 0;
                break;
            default:
                break;
        }
    }

    return {
        ...commonButtonStyles,
        fontSize,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
        fontWeight,
    };
};

/**
 * Button configuration for Material-UI.
 */
const buttonConfig = {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 24,
                fontFamily: "Lato",
                "&.Mui-disabled": {
                    cursor: "not-allowed",
                },
            },
            containedSecondary: {
                color: designTokens.palette.primary.main,
            },
            containedPrimary: {
                "&.Mui-disabled": {
                    backgroundColor: "#B3C9FF",
                    color: "#FFFFFF",
                    cursor: "not-allowed",
                },
            },
        },
        variants: [
            {
                props: { size: "large" },
                style: ({ startIcon, endIcon }) => generateButtonStyles("large", 18, !!startIcon, !!endIcon),
            },
            {
                props: { size: "medium" },
                style: ({ startIcon, endIcon }) => generateButtonStyles("medium", 16, !!startIcon, !!endIcon),
            },
            {
                props: { size: "small" },
                style: ({ startIcon, endIcon }) => generateButtonStyles("small", 14, !!startIcon, !!endIcon),
            },
        ],
    },
};

export default buttonConfig;
