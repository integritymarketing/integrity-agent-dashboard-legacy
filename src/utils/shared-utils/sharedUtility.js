import PropTypes from "prop-types";
import moment from "moment";
import * as Sentry from "@sentry/react";

/**
 * Renders a color option with styling and click handler.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.value - The value of the color option.
 * @param {string} props.label - The label of the color option.
 * @param {string} props.color - The color to display.
 * @param {boolean} [props.selected=false] - If the option is selected.
 * @param {Function} [props.onClick] - The function to call on click.
 * @param {boolean} [props.filter] - If a filter should be applied to the option.
 * @param {string} [props.className] - Additional CSS class to apply to the option.
 */
export const ColorOptionRender = ({ value, label, color, selected = false, onClick, filter, className }) => {
    const handleClick = (event) => {
        if (onClick) {
            onClick(event, value);
        }
    };

    return (
        <div className={`option ${selected ? "selected" : ""} ${filter ? className : ""}`} onClick={handleClick}>
            <span
                style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: color,
                    marginRight: 5,
                }}
            />
            <span>{label}</span>
        </div>
    );
};

ColorOptionRender.propTypes = {
    value: PropTypes.string.isRequired, // The unique identifier for the color option
    label: PropTypes.string.isRequired, // The display text for the color option
    color: PropTypes.string.isRequired, // The actual color value for the color swatch
    selected: PropTypes.bool, // Indicates if the color option is selected
    onClick: PropTypes.func, // Function to call when the color option is clicked
    filter: PropTypes.bool, // Indicates if filtering is applied to the color option
    className: PropTypes.string, // Additional CSS class to apply for custom styling
};

ColorOptionRender.defaultProps = {
    selected: false,
    onClick: null,
    filter: false,
    className: "",
};

// Utilities

// Restricts input to alphabet characters only
export const onlyAlphabets = (e) => {
    const regex = /^[a-zA-Z ]*$/;
    if (!regex.test(e.key)) {
        e.preventDefault();
    }
};

/**
 * Prevents numbers outside the range of 1 to 8 from being entered.
 * Allows empty strings to pass through.
 * @param {KeyboardEvent} e - Keyboard event triggered on key press
 */
export const onlyNumbersBetween1And8 = (e) => {
    const regex = /^[1-8]*$/;
    if (e.key !== "Backspace" && e.key !== "Delete" && !regex.test(e.key)) {
        e.preventDefault();
    }
};

/**
 * Prevents numbers outside the range of 1 to 8 from being entered.
 * Allows empty strings to pass through.
 * @param {KeyboardEvent} e - Keyboard event triggered on key press
 */
export const onlyNumbersBetween0And11 = (e) => {
    const regex = /^(0?[0-9]|1[01])$/;
    const value = e.target.value + e.key;
    if (e.key !== "Backspace" && e.key !== "Delete" && !regex.test(value)) {
        e.preventDefault();
    }
};

// Scrolls the window to the top
export const scrollTop = () => {
    window.scrollTo(0, 0);
};

// Capitalizes the first letter of a string
export const capitalizeFirstLetter = (string) => {
    if (!string) {
        return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Formats a string by replacing underscores with spaces and capitalizing words
export const formatUnderScoreString = (string) => {
    const formattedString = capitalizeFirstLetter(string);
    return formattedString.replaceAll("_", " ");
};

// Checks if an object is empty
export const isEmptyObj = (object) => {
    return Object.keys(object).length === 0;
};

// Formats a name by capitalizing the first letter of each word
export const formattedName = (string) => {
    return string.split(" ").map(capitalizeFirstLetter).join(" ");
};

// Formats a Medicare Beneficiary Identifier (MBI) by masking or formatting it
export const formatMBID = (mbid, showMBID) => {
    if (!mbid) {
        return null;
    }
    return showMBID ? formatMbiNumber(mbid) : `****-***-${mbid.slice(-4)}`;
};

// Formats a string as an MBI number
export const formatMbiNumber = (mbi) => {
    if (!mbi) {
        return "";
    }
    let formattedMbi = mbi.replace(/-/g, "");
    if (formattedMbi.length > 4) {
        formattedMbi = `${formattedMbi.slice(0, 4)}-${formattedMbi.slice(4)}`;
    }
    if (formattedMbi.length > 8) {
        formattedMbi = `${formattedMbi.slice(0, 8)}-${formattedMbi.slice(8)}`;
    }
    return formattedMbi.toUpperCase();
};

export const removeDuplicates = (array, key) => {
    if (!array) {
        return [];
    }
    const uniqueValues = new Set();
    return array?.reduce((acc, current) => {
        if (!uniqueValues.has(current[key])) {
            uniqueValues.add(current[key]);
            acc.push(current);
        }
        return acc;
    }, []);
};
const convertAndFormatUTCDateToLocalDate = (date) => {
    const isValidDate = moment(date).isValid();
    return isValidDate ? moment.utc(date).local().format("MM-DD-YYYY") : "";
};

// Reusable function to filter campaigns by status and format date
export const filterCampaignsByStatus = (list, status) => {
    if (!list || !Array.isArray(list)) {
        return [];
    }

    const filteredList = list
        .filter((campaign) => campaign.campaignStatus === status)
        .map((campaign) => ({
            ...campaign,
            runDate: campaign?.campaignRunDate
                ? convertAndFormatUTCDateToLocalDate(campaign.campaignRunDate)
                : undefined,
            createdDate: campaign?.createdDateTime
                ? convertAndFormatUTCDateToLocalDate(campaign.createdDateTime)
                : undefined,
            modifiedDate: campaign?.modifiedDateTime
                ? convertAndFormatUTCDateToLocalDate(campaign.modifiedDateTime)
                : undefined,
        }));

    return filteredList.length > 0 ? filteredList : [];
};

export const getShoppersColorScheme = (title) => {
    const priority = title?.includes("1") ? "1" : title?.includes("2") ? "2" : "3";

    const colors = {
        1: { color: "#A9905F", bgColor: "#E9E3D7" },
        2: { color: "#4178FF", bgColor: "#F1FAFF" },
        3: { color: "#052A63", bgColor: "#F1FAFF" },
    };
    return colors[priority];
};

export const getAndResetItemFromLocalStorage = (key, initialValue) => {
    try {
        const item = window.localStorage.getItem(key);
        const val = item ? JSON.parse(item) : initialValue;
        return val;
    } catch (error) {
        Sentry.captureException(error);
        window.localStorage.removeItem(key);
        return initialValue;
    }
};

export const isHaveCarrierId = (url) => {
    if (!url) {
        return false;
    }
    // Create a URL object
    const urlObj = new URL(url);

    // Use URLSearchParams to get the query parameters
    const params = new URLSearchParams(urlObj.search);

    // Get the carrierId value
    const carrierId = params.get("carrierId");

    return carrierId === null || carrierId === 0 || carrierId === "0" || carrierId === undefined ? false : true;
};

// Define the words to be styled in black
const blackWords = ["if", "is", "not", "becomes\n", "when", "becomes"]; // Replace with your specific words

const blackWordStyle = "color: #434a51; font-size: 16px; font-style: italic; margin-right: 4px;";
const blueWordStyle = "color: #052a63; font-weight: 600; font-size: 16px; margin-right: 4px;";
const normalStyle = "color: #717171; font-weight: 400; font-size: 16px; margin-left: 4px;";

// Function to style the actionDescription
export const styleActionDescription = (description) => {
    if (!description) {
        return description;
    }
    return description
        ?.split(" ")
        ?.map((word, index) => {
            const cleanWord = word.replace(/[.,?!;:()]/g, ""); // Remove punctuation for accurate matching
            if (blackWords.includes(cleanWord.toLowerCase())) {
                return `<span style="${blackWordStyle}">${word}</span>`;
            } else {
                return `<span style="${blueWordStyle}">${word}</span>`;
            }
        })
        .join(" ");
};

const cleanDescription = (description) => {
    // Remove nested span tags and clean up HTML
    return description.replace(/<span>\s*<\/span>/g, "").replace(/<\/?span>/g, "<span>");
};

export const styleEventDescription = (description, isNormal) => {
    if (!description) {
        return description;
    }

    // Clean description format to remove redundant span tags
    const cleanedDescription = cleanDescription(description);

    // Convert description to plain text and replace "is" with "becomes"
    const output = cleanedDescription
        .replace(/<[^>]+>/g, "") // Remove HTML tags to get plain text
        .replace(/\bis\b/g, "becomes"); // Replace "is" with "becomes"

    // Map over words and style based on `blackWords` array
    return output
        .split(" ")
        .map((word) => {
            if (!word) {
                return word;
            }
            const cleanWord = word.replace(/[.,?!;:()]/g, ""); // Remove punctuation for matching

            if (blackWords.includes(cleanWord.toLowerCase())) {
                return `<span style="${isNormal ? normalStyle : blackWordStyle}">${word}</span>`;
            } else {
                return `<span style="${isNormal ? normalStyle : blueWordStyle}">${word}</span>`;
            }
        })
        .join(" ");
};

export const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
