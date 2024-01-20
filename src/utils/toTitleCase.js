export function toTitleCase(str) {
    if (!str) {
        return "";
    }

    return str
        .toLowerCase()
        .split(" ")
        .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}

export function convertToTitleCase(inputString) {
    // Split the string by underscore
    let parts = inputString.split("_");

    // Capitalize the first letter of each part
    parts = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());

    // Join the parts with a forward slash
    return parts.join("/");
}
