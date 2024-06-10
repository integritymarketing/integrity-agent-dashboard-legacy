export const greetings = () => {
    const myDate = new Date();
    const hours = myDate.getHours();
    let greet;

    if (hours < 12) {
        greet = "Morning";
    } else if (hours >= 12 && hours <= 17) {
        greet = "Afternoon";
    } else if (hours >= 17 && hours <= 24) {
        greet = "Evening";
    }
    return greet;
};
