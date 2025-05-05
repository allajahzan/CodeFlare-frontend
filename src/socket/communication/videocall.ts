import { IUser } from "@/types/IAttendence";
import { socket } from "./socket";
import * as mediasoupClient from "mediasoup-client";
import { handleCustomError } from "@/utils/error";

/**
 * Emits a "joinRoom" event to the server and triggers the provided callback
 * with the rtpCapabilities and existingProducers received from the server.
 * @param roomId - The id of the room to join.
 * @param callback - A function to be called with the rtpCapabilities and
 * existingProducers of the room.
 */
export const joinRoom = (
    roomId: string,
    userId: string,
    callback: (
        rtpCapabilities: mediasoupClient.types.RtpCapabilities,
        existingProducers: any
    ) => void
) => {
    try {
        socket.emit(
            "joinRoom",
            { roomId, userId },
            (
                error: { message: string; status: number },
                rtpCapabilities: mediasoupClient.types.RtpCapabilities,
                existingProducers: any
            ) => {
                if (error) {
                    handleCustomError(error);
                    return;
                }
                callback(rtpCapabilities, existingProducers);
            }
        );
    } catch (err: unknown) {
        console.error(err);
    }
};

/**
 * Emits a "createWebRtcTransport" event to the server and triggers the provided callback
 * with the transport parameters received from the server.
 * @param roomId - The ID of the room for which the transport is being created.
 * @param sender - A boolean indicating if the transport is for a producer (true) or consumer (false).
 * @param callback - A function to be called with the transport parameters.
 */
export const createTransport = (
    sender: boolean,
    roomId: string,
    callback: (params: any) => void
) => {
    try {
        socket.emit(
            "createWebRtcTransport",
            { sender, roomId },
            ({ params }: any) => {
                if (params?.err) {
                    console.error("Transport creation error:", params.err);
                    return;
                }
                callback(params);
            }
        );
    } catch (err) {
        console.error(err);
    }
};

/**
 * Listens for the "newProducer" event from the server and triggers the provided
 * callback with the producerId, kind, appData, and socketId of the new producer.
 * @param callback - A function to be called with the producerId, kind, appData, and
 * socketId of the new producer.
 */
export const onNewProducer = (
    callback: ({
        producerId,
        appData,
        socketId,
        user,
    }: {
        producerId: string;
        appData: any;
        socketId: string;
        user: IUser;
    }) => void
) => {
    try {
        socket.on("newProducer", (data) => {
            callback(data);
        });
    } catch (err: unknown) {
        console.log(err);
    }
};

/**
 * Listens for the "peerMuteChange" event from the server and triggers the provided
 * callback with the type, isMuted, and socketId of the peer that changed mute state.
 * The callback is also removed when the returned function is called.
 * @param callback - A function to be called with the type, isMuted, and socketId of
 * the peer that changed mute state.
 * @returns A function to be called when the event listener should be removed.
 */
export const onPeerMuteChange = (
    callback: ({
        type,
        isMuted,
        socketId,
    }: {
        type: "audio" | "video";
        isMuted: boolean;
        socketId: string;
    }) => void
) => {
    try {
        socket.on("peerMuteChange", callback);
    } catch (err: unknown) {
        console.log(err);
    }
};

/**
 * Emits a "handRaise" event to the server with the given roomId, isHandRaise, and
 * socketId. This will notify the server of a change in hand raise state for the
 * given peer.
 * @param roomId - The ID of the room in which the peer is located.
 * @param isHandRaised - Whether the peer is currently raising their hand.
 * @param socketId - The ID of the socket of the peer that changed hand raise state.
 */
export const handRaise = (
    roomId: string,
    isHandRaised: boolean,
    socketId: string
) => {
    try {
        socket.emit("handRaise", { roomId, isHandRaised, socketId });
    } catch (err: unknown) {
        console.log(err);
    }
};

/**
 * Listens for the "handRaiseChange" event from the server and triggers the
 * provided callback with the isRaise and socketId of the peer that changed
 * hand raise state. The callback is also removed when the returned function
 * is called.
 * @param callback - A function to be called with the isRaise and socketId of
 * the peer that changed hand raise state.
 * @returns A function to be called when the event listener should be removed.
 */
export const onHandRaiseChange = (
    callback: ({
        isHandRaised,
        socketId,
    }: {
        isHandRaised: boolean;
        socketId: string;
    }) => void
) => {
    try {
        socket.on("handRaiseChange", callback);
    } catch (err: unknown) {
        console.log(err);
    }
};

/**
 * Emits a "leaveCall" event to the server with the provided roomId.
 * This removes the user from the video call room and cleans up the peer's resources.
 * @param roomId - The ID of the room to leave.
 */
export const leaveMeet = (roomId: string) => {
    try {
        socket.emit("leaveCall", { roomId });
    } catch (err: unknown) {
        console.log(err);
    }
};

/**
 * Listens for the "peerLeft" event from the server and triggers the provided
 * callback with the socketId of the peer that left the room.
 * The callback is also removed when the returned function is called.
 * @param callback - A function to be called with the socketId of the peer that left
 * the room.
 * @returns A function to be called when the event listener should be removed.
 */
export const onPeerLeft = (callback: (socketId: string) => void) => {
    socket.on("peerLeft", ({ socketId }) => {
        callback(socketId);
    });
};
