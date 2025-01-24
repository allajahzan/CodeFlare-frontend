import axiosInstance from "./axiosInstance";
import { throwCustomError } from "./error";

/**
 * Fetches data from the given URL and returns the response.
 * @param url The URL to make the GET request to.
 * @returns The response data.
 * @throws The error if the request fails.
 */
export const fetchData = async (url: string) => {
    try {
        const resp = await axiosInstance.get(url);
        return resp;
    } catch (err: any) {
        throwCustomError(err);
    }
};

/**
 * Posts data to the given URL and returns the response.
 * @param url The URL to make the POST request to.
 * @param data The data to be sent in the request body.
 * @returns The response data.
 * @throws The error if the request fails.
 */
export const postData = async (url: string, data?: any) => {
    try {
        const resp = await axiosInstance.post(url, data || null);
        return resp;
    } catch (err: any) {
        throwCustomError(err);
    }
};

/**
 * Performs a full update of the data at the given URL, replacing the existing data.
 * @param url The URL to make the PUT request to.
 * @param data The data to be sent in the request body.
 * @returns The response data.
 * @throws The error if the request fails.
 */
export const updateData = async (url: string, data?: any) => {
    try {
        const resp = await axiosInstance.put(url, data || null);
        return resp;
    } catch (err: any) {
        throwCustomError(err);
    }
};

/**
 * Performs a partial update of the data at the given URL, updating only the fields given in the request body.
 * @param url The URL to make the PATCH request to.
 * @param data The data to be sent in the request body.
 * @returns The response data.
 * @throws The error if the request fails.
 */
export const patchData = async (url: string, data?: any) => {
    try {
        const resp = await axiosInstance.patch(url, data || null);
        return resp;
    } catch (err: any) {
        throwCustomError(err);
    }
};

/**
 * Deletes the data at the given URL.
 * @param url The URL to make the DELETE request to.
 * @returns The response data.
 * @throws The error if the request fails.
 */
export const deleteData = async (url: string) => {
    try {
        const resp = await axiosInstance.delete(url);
        return resp;
    } catch (err: any) {
        throwCustomError(err);
    }
};
