import Navbar from "../common/navbar/navbar";
import { useCallback, useEffect, useRef, useState } from "react";
import * as mediasoupClient from "mediasoup-client";
import { socket } from "@/socket/communication/connect";
import JoinMeeting, { IMeet } from "./join-meeting";
import MeetingRoom from "./meeting-room";
import { useLocation } from "react-router-dom";
import MeetingExit from "./meeting-exit";
import {
    createTransport,
    joinRoom,
    onNewProducer,
} from "@/socket/communication/videoCallSocket";

// mediasoup track params
let trackParams = {
    encodings: [
        {
            rid: "r0",
            maxBitrate: 100000,
            scalabilityMode: "S1T3",
        },
        {
            rid: "r1",
            maxBitrate: 300000,
            scalabilityMode: "S1T3",
        },
        {
            rid: "r2",
            maxBitrate: 900000,
            scalabilityMode: "S1T3",
        },
    ],
    codecOptions: {
        videoGoogleStartBitrate: 1000,
    },
    audioEncodings: [
        {
            maxBitrate: 64000, // Adjust this based on network conditions
        },
    ],
    codecOptionsAudio: {
        opusStereo: true,
        opusDtx: true,
    },
};

// Meet Component
function Meet() {
    // ===================== state used for local stream ================================================

    // Stream
    const [stream, setStream] = useState<MediaStream | null>(null);

    // Video ref
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Mute-unmute states
    const [isAudioMute, setAudioMute] = useState<boolean>(false);
    const [isVideoMute, setVideoMute] = useState<boolean>(false);

    // ===================== states used for webrtc =====================================================

    const [isJoined, setJoined] = useState<boolean | null>(false);
    const [isMeetLeft, setMeetLeft] = useState<boolean>(false);
    const [meet, setMeet] = useState<IMeet | null>(null);

    const roomId = useLocation().pathname.split("/")[3];

    // Peers
    const [peers, setPeers] = useState<{
        [socketId: string]: {
            media: MediaStream;
            isVideoMute: boolean;
            isAudioMute: boolean;
        };
    }>({});

    // Device
    const deviceRef = useRef<mediasoupClient.Device | null>(null);

    // Sender Transport
    // const sendTransportRef = useRef<mediasoupClient.types.Transport | null>(null);

    // Receiver Transport
    // const recvTransportRef = useRef<mediasoupClient.types.Transport | null>(null);

    // Existing producers
    const pendingProducersRef = useRef<any[]>([]);

    // ===================================================================================================

    // Handle video
    const handleVideo = useCallback(() => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0]; // Get video track

            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled; // Enable-Disable

                // Update state and localStorage
                setVideoMute((prev) => !prev);
                localStorage.setItem("isVideoMute", videoTrack.enabled ? "0" : "1");

                // When mute
                videoTrack.onmute = () => {
                    socket.emit("muteToggle", {
                        roomId,
                        type: "video",
                        isMuted: true,
                        socketId: socket.id,
                    });
                };

                // When unmute
                videoTrack.onunmute = () => {
                    socket.emit("muteToggle", {
                        roomId,
                        type: "video",
                        isMuted: false,
                        socketId: socket.id,
                    });
                };

                // Track mute/unmute event
                if (isJoined) {
                    const event = new Event(videoTrack.enabled ? "unmute" : "mute");
                    videoTrack.dispatchEvent(event);
                }
            }
        }
    }, [stream, socket, roomId, isJoined]);

    // Handle local video streaming on mute and unmute
    useEffect(() => {
        if (!isVideoMute && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch((err) => console.log(err));
        }
    }, [isVideoMute, stream]);

    // Handle audio
    const handleAudio = useCallback(() => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0]; // Get audio track
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled; // Enable-Disable

                // Update state and local storage
                setAudioMute((prev) => !prev);
                localStorage.setItem("isAudioMute", audioTrack.enabled ? "0" : "1");

                // When mute
                audioTrack.onmute = () => {
                    socket.emit("muteToggle", {
                        roomId,
                        type: "audio",
                        isMuted: true,
                        socketId: socket.id,
                    });
                };

                // When unmute
                audioTrack.onunmute = () => {
                    socket.emit("muteToggle", {
                        roomId,
                        type: "audio",
                        isMuted: false,
                        socketId: socket.id,
                    });
                };

                // Track mute/unmute event
                if (isJoined) {
                    const event = new Event(audioTrack.enabled ? "unmute" : "mute");
                    audioTrack.dispatchEvent(event);
                }
            }
        }
    }, [stream, socket, roomId, isJoined]);

    // ========================= WebRtc with socket IO and mediasoup ===========================================

    // Join room and create device =============================================================================
    useEffect(() => {
        if (isJoined) {
            joinRoom(roomId, async (rtpCapabilities, existingProducers) => {
                // Create and load the device
                const newDevice = new mediasoupClient.Device();
                await newDevice.load({ routerRtpCapabilities: rtpCapabilities });

                // Update the device
                deviceRef.current = newDevice;

                // Update existing producers
                pendingProducersRef.current = existingProducers;

                // Create producer transport
                goCreateTransport(true);
            });
        }
    }, [isJoined]);

    // Listen for new producers
    useEffect(() => {
        onNewProducer(async ({ producerId, kind, appData, socketId }) => {
            console.log(producerId, kind, appData, socketId);

            // Create receiver transport
            const recvTransport = await goCreateTransport(false);
            if (!recvTransport) return;

            // Connect and consume media
            connectAndConsumeMedia(producerId, appData, socketId, recvTransport);
        });

        return () => {
            socket.off("newProducer");
        };
    }, []);

    // Create webrtc transports (both producer and consumer), also listen for new producer =====================
    const goCreateTransport = async (
        sender: boolean
    ): Promise<mediasoupClient.types.Transport | undefined> => {
        return new Promise((resolve, reject) => {
            try {
                createTransport(sender, roomId, (params) => {
                    // console.log("Transport created with params:", params);

                    if (sender) {
                        // SendTransport
                        const sendTransport =
                            deviceRef.current?.createSendTransport(params);
                        if (!sendTransport) return reject("SendTransport not created");

                        // Set sendtransport event listeners
                        setSendTransportEventListners(sendTransport);

                        // Connect and produce media
                        connectAndProduceMedia(sendTransport);

                        // Resolve sendTranport
                        resolve(sendTransport);
                    } else {
                        // ReceiveTransports
                        const recvTransport =
                            deviceRef.current?.createRecvTransport(params);
                        if (!recvTransport) return reject("RecvTransport not created");

                        // Set receivetransport event listeners
                        setRecvTransportEventListners(recvTransport);

                        // Resolve resvTransport
                        resolve(recvTransport);
                    }
                });
            } catch (err) {
                console.error("Error in goCreateTransport:", err);
                reject(err);
            }
        });
    };

    // Send tranpsort event listners
    const setSendTransportEventListners = (
        sendTransport: mediasoupClient.types.Transport
    ) => {
        try {
            // Connect transport - will trigger, when produce() method in sendTransport calls
            sendTransport.on("connect", ({ dtlsParameters }, callback, errback) => {
                try {
                    socket.emit("connectTransport", {
                        roomId,
                        transportId: sendTransport.id,
                        dtlsParameters,
                    });

                    callback(); // Notify parameters are transmitted
                } catch (err: any) {
                    console.log(err);
                    errback(err);
                }
            });

            // Produce transport - will trigger, when produce() method in sendTransport calls
            sendTransport.on("produce", async (parameters, callback, errback) => {
                try {
                    const muteState =
                        parameters.kind === "audio"
                            ? { isAudioMute: isAudioMute ?? false }
                            : { isVideoMute: isVideoMute ?? false };

                    socket.emit(
                        "produceTransport",
                        {
                            roomId,
                            transportId: sendTransport.id,
                            kind: parameters.kind,
                            rtpParameters: parameters.rtpParameters,
                            ...muteState,
                        },
                        ({ producerId }: { producerId: string }) => {
                            callback({ id: producerId });
                            // Notify parameters are transmitted
                            // and got the producer id
                        }
                    );
                } catch (err: any) {
                    errback(err);
                }
            });
        } catch (err: unknown) {
            console.log(err);
        }
    };

    // Connect to sendTransport and produce media
    const connectAndProduceMedia = async (
        sendTransport: mediasoupClient.types.Transport
    ) => {
        try {
            if (!stream) return;

            // Get video & audio tracks
            const videoTrack = stream.getVideoTracks()[0];
            const audioTrack = stream.getAudioTracks()[0];

            // Produce video
            if (videoTrack) {
                const videoProducer = await sendTransport?.produce({
                    encodings: trackParams.encodings,
                    codecOptions: trackParams.codecOptions,
                    track: videoTrack,
                    appData: { isVideoMute },
                });

                videoProducer?.on("trackended", () => {
                    console.log("Video track ended");
                });

                videoProducer?.on("transportclose", () => {
                    console.log("Video transport ended");
                });
            }

            // Produce audio
            if (audioTrack) {
                const audioProducer = await sendTransport?.produce({
                    encodings: trackParams.audioEncodings,
                    codecOptions: trackParams.codecOptionsAudio,
                    track: audioTrack,
                    appData: { isAudioMute },
                });

                audioProducer?.on("trackended", () => {
                    console.log("Audio track ended");
                });

                audioProducer?.on("transportclose", () => {
                    console.log("Audio transport ended");
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Receiver Transport event listeners
    const setRecvTransportEventListners = async (
        recvTranpsort: mediasoupClient.types.Transport
    ) => {
        try {
            // Connect transport - will trigger when consume() at server side called
            recvTranpsort.on("connect", ({ dtlsParameters }, callback, errback) => {
                try {
                    socket.emit("connectTransport", {
                        roomId,
                        transportId: recvTranpsort.id,
                        dtlsParameters,
                    });

                    callback(); // Notify parameters are transmitted

                    console.log("haayyyyyyyyyy");
                } catch (err: any) {
                    console.log(err);
                    errback(err);
                }
            });
        } catch (err: unknown) {
            console.log(err);
        }
    };

    // Connect to recvtransport and consume media
    const connectAndConsumeMedia = async (
        producerId: string,
        appData: any,
        socketId: string,
        recvTransport: mediasoupClient.types.Transport
    ) => {
        try {
            const device = deviceRef.current;

            if (!device || !recvTransport) return;

            console.log("consuming brooooo");

            // Consume media
            socket.emit(
                "consume",
                {
                    roomId,
                    transportId: recvTransport.id,
                    producerId: producerId,
                    rtpCapabilities: device.rtpCapabilities,
                    appData: appData,
                },
                async ({ params }: any) => {
                    if (params.err) {
                        console.log(params.err);
                        return;
                    }

                    // Consumer
                    const consumer = await recvTransport.consume({
                        id: params.id,
                        producerId: params.producerId,
                        kind: params.kind,
                        rtpParameters: params.rtpParameters,
                        appData: params.appData,
                    });

                    if (!consumer) return;

                    const { track } = consumer; // track from remote peer

                    console.log("going to resume brooooo");

                    // Emit event to resume consumer
                    socket.emit(
                        "resumeConsumer",
                        { roomId, consumerId: consumer.id },
                        ({ params }: any) => {
                            console.log(params.success);
                        }
                    );

                    // Update peers with remote stream, adding track dynamically
                    setPeers((prevPeers) => {
                        const existingPeer = prevPeers[socketId];

                        // Create a new stream if not exists, otherwise  add track to it
                        const newStream = existingPeer
                            ? new MediaStream(existingPeer.media.getTracks())
                            : new MediaStream();

                        newStream.addTrack(track);

                        // console.log(consumerParams.appData);

                        return {
                            ...prevPeers,
                            [socketId]: {
                                media: newStream,
                                isVideoMute:
                                    appData.isVideoMute ?? existingPeer?.isVideoMute ?? false,
                                isAudioMute:
                                    appData.isAudioMute ?? existingPeer?.isAudioMute ?? false,
                            },
                        };
                    });
                }
            );
        } catch (err: unknown) {
            console.log(err);
        }
    };

    useEffect(() => {
        console.log("updated peers", peers);
    }, [peers]);

    // Listen mute unmute changes ==============================================================================
    useEffect(() => {
        const handlePeerMuteChange = ({
            type,
            isMuted,
            socketId,
        }: {
            type: "audio" | "video";
            isMuted: boolean;
            socketId: string;
        }) => {
            // Update peers
            setPeers((prevPeers) => {
                if (!prevPeers[socketId]) return prevPeers; // Ensure peer exists

                return {
                    ...prevPeers,
                    [socketId]: {
                        ...prevPeers[socketId],
                        [`is${type === "video" ? "Video" : "Audio"}Mute`]: isMuted,
                    },
                };
            });
        };

        // Listen to event
        socket.on("peerMuteChange", handlePeerMuteChange);

        return () => {
            socket.off("peerMuteChange", handlePeerMuteChange);
        };
    }, []);

    // ==========================================================================================================

    return (
        <div className="h-screen dotted-bg">
            <div className="flex flex-col h-full w-full relative transition-all">
                {/* Navbar */}
                {true && <Navbar />}

                {/* Join video call */}
                {isJoined === false && (
                    <JoinMeeting
                        videoRef={videoRef}
                        setJoined={setJoined}
                        isVideoMute={isVideoMute}
                        isAudioMute={isAudioMute}
                        handleVideo={handleVideo}
                        handleAudio={handleAudio}
                        stream={stream}
                        setStream={setStream}
                        meet={meet as IMeet}
                        setMeet={setMeet}
                    />
                )}

                {/* Meeting room */}
                {isJoined === true && (
                    <MeetingRoom
                        isVideoMute={isVideoMute}
                        isAudioMute={isAudioMute}
                        videoRef={videoRef}
                        stream={stream}
                        handleVideo={handleVideo}
                        handleAudio={handleAudio}
                        peers={peers}
                        setMeetLeft={setMeetLeft}
                        setJoined={setJoined}
                    />
                )}

                {/* Meet exit page */}
                {isMeetLeft && (
                    <MeetingExit
                        deviceRef={deviceRef}
                        setJoined={setJoined}
                        setMeetLeft={setMeetLeft}
                    />
                )}
            </div>
        </div>
    );
}

export default Meet;
