import { toast } from "@/hooks/use-toast";

/**
 * Throws a custom error object with a status and message based on the input error
 * @param {object} err - The error object to be thrown
 * @returns {object} - A custom error object with a status and message
 * @throws - The custom error object
 */
export const throwCustomError = (err: any) => {
    if (err.response) {
        const { status, data } = err.response;
        throw { status, message: data.errors?.[0].message || data.message || "An error occurred" };
    } else if (err.request) {
        // no response
        throw { status: 0, message: "Network error. Please try again later." };
    } else {
        throw {
            status: -1,
            message: err.message || "An unexpected error occurred",
        };
    }
};

/**
 * Handles error responses from API calls and displays a toast notification
 * appropriate for the error status code
 * @param {object} err - The error object from the API response
 */
export const handleCustomError = (err: any) => {
    console.log(err);
    if (err.status === 401) toast({ title: err.message });
    else if (err.status === 403) toast({ title: err.message });
    else if (err.status === 404) toast({ title: err.message });
    else if (err.status === 409) toast({ title: err.message });
    else if (err.status === 500) toast({ title: err.message });
    else if (err.status === 501) toast({ title: err.message });
    else if (err.status === 504) toast({ title: err.message });
    else if (err.status === 0) toast({ title: err.message });
    else toast({ title: err.messagee });
};
