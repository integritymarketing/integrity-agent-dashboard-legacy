export const heightValidation = (e) => {
    const regex = /^[1-9][0-2]?$/; // Updated regex pattern
    const value = e.target.value + e.key; // Calculate the value after the keypress
    if (e.key !== "Backspace" && e.key !== "Delete" && !regex.test(value)) {
        e.preventDefault();
    }
};