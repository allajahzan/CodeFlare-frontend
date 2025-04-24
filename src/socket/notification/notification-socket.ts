import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_NOTIFICATION_SOCKET);

/**
 * Listens for "reciveSnapshotMessage" events from the notification socket server and triggers the provided callback when a message is received.
 * @param callback - The callback function to be triggered when a message is received.
 */
export const reciveSnapshotMessage = async (
    callback: (data: { message: string; time: string }) => void
) => {
    try {
        socket.on(
            "reciveSnapshotMessage",
            (data: { message: string; time: string }) => {
                callback(data);
            }
        );
    } catch (err: unknown) {
        console.log(err);
    }
};
