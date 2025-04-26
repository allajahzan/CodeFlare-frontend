/**
 * Returns a human-readable relative time difference between the current time and a given date string.
 * @param dateStr - The date string to compare with the current time.
 * @returns A string representing the time difference in a human-readable format.
 *          For example, "5 minutes ago", "2 hours ago", "Yesterday", or "3 days ago".
 */
export const getRelativeTime = (dateStr: string): string => {
    const inputDate = new Date(dateStr);
    const now = new Date();

    const diff = now.getTime() - inputDate.getTime();
    const diffMins = Math.floor(diff / (1000 * 60));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    // Check is it same day
    const isSameDay = now.toDateString() === inputDate.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    // Check is it yesterday
    const isYesterday = yesterday.toDateString() === inputDate.toDateString();

    if (isSameDay) {
        if (diffMins < 60) {
            return `${diffMins} minute ago`;
        }
        return `${diffHours} hour ago`;
    } else if (isYesterday) {
        return "Yesterday";
    } else {
        // return inputDate.toLocaleDateString("en-US", {
        //     day: "numeric",
        //     month: "short",
        //     year: "numeric",
        // });
        return `${diffDays} days ago`;
    }
};
