/**
 * Utility function to calculate call duration from `00:00:00` format to `0hr 0min 0sec`
 *
 * @param {string} duration - The call duration to format.
 * @returns {string} - The formatted call duration.
 */
export const calculateCallDuration = (duration) => {
    if (!duration) return;

    const [hours, minutes, seconds] = duration.split(":").map(Number);
    const parts = [hours ? `${hours}hr` : '', minutes ? `${minutes}min` : '', seconds ? `${seconds}sec` : ''].filter(x => x);
    return parts.join(' ');
}