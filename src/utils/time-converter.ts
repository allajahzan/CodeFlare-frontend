/**
 * Converts 24-hour time to 12-hour time
 * @param {string} time 24-hour time in "HH:MM" format
 * @returns {string} 12-hour time in "hh:mm AM/PM" format
 */
export const convertTo12HourFormat = (time: string) => {
    const [hours, minutes] = time.split(":"); 
    return new Date(0, 0, 0, Number(hours), Number(minutes))
        .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

