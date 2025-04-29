import { socket } from "./socket";
import { INotification } from "@/types/notification";

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

/**
 * Listens for "receiveNotification" events from the notification socket server and triggers
 * the provided callback with the received warning data.
 * @param callback - The callback function to be triggered with the warning data when a notification is received.
 */
export const receiveNotification = async (
    callback: (notification: INotification) => void
) => {
    try {
        socket.on("receiveNotification", (notification: INotification) => {
            callback(notification);
        });
    } catch (err: unknown) {
        console.log(err);
    }
};
