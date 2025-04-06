import { socket } from "./connect";
import * as mediasoupClient from "mediasoup-client";

/**
 * Emits a "joinRoom" event to the server and triggers the provided callback
 * with the rtpCapabilities and existingProducers received from the server.
 * @param roomId - The id of the room to join.
 * @param callback - A function to be called with the rtpCapabilities and
 * existingProducers of the room.
 */
export const joinRoom = (
    roomId: string,
    callback: (
        rtpCapabilities: mediasoupClient.types.RtpCapabilities,
        existingProducers: any
    ) => void
) => {
    try {
        socket.emit(
            "joinRoom",
            { roomId },
            (
                rtpCapabilities: mediasoupClient.types.RtpCapabilities,
                existingProducers: any
            ) => {
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
        kind,
        appData,
        socketId,
    }: {
        producerId: string;
        kind: mediasoupClient.types.MediaKind;
        appData: any;
        socketId: string;
    }) => void
) => {
    socket.on("newProducer", (data) => {
        console.log("listening");
        
        callback(data);
    });
};

