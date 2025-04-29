import { format, isToday, isYesterday, isThisWeek } from "date-fns";

/**
 * Returns a formatted relative time string based on the input date.
 * @param dateStr - The ISO string or date string to format.
 * @returns A relative time string.
 */
export const getRelativeTime = (dateStr: string): string => {
    const inputDate = new Date(dateStr);

    if (isToday(inputDate)) {
        return format(inputDate, "h:mm a"); // eg: 3:45 PM
    }

    if (isYesterday(inputDate)) {
        return "Yesterday";
    }

    if (isThisWeek(inputDate)) {
        return format(inputDate, "EEEE"); // eg: Monday
    }

    return format(inputDate, "dd/MM/yyyy"); // eg: 30/05/2002
};
