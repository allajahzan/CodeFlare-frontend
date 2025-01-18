/**
 * Throws a custom error object with a status and message based on the input error
 * @param {object} err - The error object to be thrown
 * @returns {object} - A custom error object with a status and message
 * @throws - The custom error object
 */
export const throwCustomError = (err : any) => {
    if (err.response) {
        const { status, data } = err.response;
        throw { status, message: data.message || "An error occurred" };
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
