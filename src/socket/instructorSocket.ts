import { IReview } from "@/types/review";
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_INSTRUCTOR_SOCKET);

/**
 * Emits a "loadReviews" event to the server to load reviews that match the given search criteria.
 * @param keyword - The keyword to search for in the review's title, week, or user's name or email.
 * @param sort - The field to sort the result by.
 * @param order - The order to sort the result by, either 1 for ascending or -1 for descending.
 * @param date - The date to filter reviews by.
 * @param status - The status of the reviews to search for, either "true" or "false".
 * @param batchIds - The list of batchIds to search for reviews in.
 * @param skip - The number of reviews to skip before returning the result.
 */
export const loadReviews = (
    keyword: string,
    sort: string,
    order: number,
    date: string,
    status: string,
    batchIds: string[],
    skip: number
) => {
    socket.emit(
        "loadReviews",
        keyword,
        sort,
        order,
        date,
        status,
        batchIds,
        skip
    );
};

/**
 * Listens for the "loadedReviews" event from the server and calls the given callback with the received reviews.
 * @param callBack - The callback function to call with the received reviews.
 */
export const loadedReviews = (
    callBack: (data: IReview[]) => void
) => {
    socket.on("loadedReviews", (data) => {
        callBack(data)
    });
};
