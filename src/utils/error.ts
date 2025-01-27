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
        throw {
            status,
            message: data?.errors?.message || data?.message || "An error occurred",
        };
    } else if (err.request) {
        // no response
        throw { status: 0, message: "Network error. Please try again later." };
    } else {
        throw {
            status: -1,
            message: err?.message || "An unexpected error occurred",
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

    let data;
    if(err.response) data = err.response.data

    // 400: Bad Request
    if (err.status === 400) toast({ title: data?.errors?.message || err?.message });

    // 401: Unauthorized
    else if (err.status === 401) toast({ title: data?.errors?.message || err?.message });

    // 403: Forbidden
    else if (err.status === 403)
        toast({
            title: data?.errors?.message || err?.message,
        });

    // 404: Not Found
    else if (err.status === 404)
        toast({
            title: data?.errors?.message || err?.message,
        });

    // 409: Conflict
    else if (err.status === 409)
        toast({
            title: data?.errors?.message || err?.message,
        });

    // 410: Gone
    else if (err.status === 410) toast({ title: data?.errors?.message });

    // 500: Internal Server Error
    else if (err.status === 500)
        toast({
            title: data?.errors?.message || err?.message || "Internal server error",
        });

    // 501: Not Implemented
    else if (err.status === 501)
        toast({
            title: "An unexpected error occurred",
        });

    // 504: Gateway Timeout
    else if (err.status === 504)
        toast({
            title: "An unexpected error occurred",
        });

    // 0: Network Error
    else if (err.status === 0) toast({ title: err?.message });

    // -1: Unexpected Error
    else
        toast({
            title: data?.message || err?.message,
        });
};
