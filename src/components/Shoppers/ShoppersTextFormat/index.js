import PropTypes from "prop-types";
import { Box } from "@mui/material";

/**
 * A React component that formats the given text.
 * It displays normal text until a double pipe "||" is found.
 * After "||", it displays the following lines with bullet points.
 * New lines in the bullet text are split by "\n" and displayed as bullet points.
 * @param {Object} props - Props passed to the component.
 * @param {string} props.inputText - The input text that needs to be formatted.
 * @param {string} [props.fontSize="19px"] - The font size of the text.
 * @param {string} [props.color="#717171"] - The color of the text.
 */
const TextFormatter = ({ inputText, fontSize = "14px", color = "#717171" }) => {
    /**
     * Formats the given input text.
     * - Text before "||" is displayed as a paragraph.
     * - Text after "||" and split by "\n" is displayed as bullet points.
     * @param {string} text - The text to be formatted.
     * @returns {JSX.Element} The formatted text in JSX form.
     */
    const formatText = (text) => {
        // Replace occurrences of '||\\n' with '||' to clean up the input
        const cleanedText = text.replace(/\|\|\\n/g, "||");

        // Split the text by '\n' to create bullet points
        const textParts = cleanedText.split("\\n");

        return (
            <Box sx={{ fontSize: fontSize, color: color }}>
                {textParts.map((part, index) => (
                    <Box key={index}>
                        {/* Add a bullet if the line contains '||' and remove the '||' */}
                        {part.includes("||") ? (
                            <>
                                <span>&bull;</span> {part.replace("||", "").trim()}
                            </>
                        ) : (
                            part.trim()
                        )}
                    </Box>
                ))}
            </Box>
        );
    };

    return <div>{formatText(inputText)}</div>;
};

TextFormatter.propTypes = {
    inputText: PropTypes.string.isRequired, // The raw text input to be formatted
    fontSize: PropTypes.string, // Font size to be applied to the text
    color: PropTypes.string, // Text color
};

export default TextFormatter;
