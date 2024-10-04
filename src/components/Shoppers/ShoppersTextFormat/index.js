import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import styles from "./styles.module.scss";

/**
 * A React component that formats the given text.
 * It displays normal text until a double pipe "||" is found.
 * After "||", it displays the following lines with bullet points.
 * New lines in the bullet text are split by "\n" and displayed as bullet points.
 * @param {Object} props - Props passed to the component.
 * @param {string} props.inputText - The input text that needs to be formatted.
 */
const TextFormatter = ({ inputText }) => {
    /**
     * Formats the given input text.
     * - Text before "||" is displayed as a paragraph.
     * - Text after "||" and split by "\n" is displayed as bullet points.
     * @param {string} text - The text to be formatted.
     * @returns {JSX.Element} The formatted text in JSX form.
     */
    const formatText = (text) => {
        // Replace '\\n' with '\n' for correct line breaks
        const formattedText = text.replace(/\\n/g, "\n");

        // Split the text into the part before and after "||"
        const [plainText, bulletPointText] = formattedText.split("||");

        // If there is bulletPointText, split it by "\n"
        const bulletPoints = bulletPointText ? bulletPointText.split("\n") : [];

        return (
            <Box className={styles.formattedText}>
                {/* Display the plain text before "||" */}
                <p>{plainText.trim()}</p>

                {/* Display each bullet point if bulletPointText exists */}
                {bulletPoints.length > 0 &&
                    bulletPoints.map((bullet, index) => (
                        <Box key={index}>
                            {bullet.trim()?.length > 0 && "•"} {bullet.trim()}
                        </Box>
                    ))}
            </Box>
        );
    };

    return <div>{formatText(inputText)}</div>;
};

TextFormatter.propTypes = {
    // inputText is required and should be a string
    inputText: PropTypes.string.isRequired, // The raw text input for formatting
};

export default TextFormatter;
