import Navbar from "../common/navbar/navbar";
import { useCallback, useEffect, useRef, useState } from "react";
import * as mediasoupClient from "mediasoup-client";
import { socket } from "@/socket/communication/connect";
import JoinMeeting, { IMeet } from "./join-meeting";
import MeetingRoom from "./meeting-room";
import { useLocation } from "react-router-dom";
import MeetingExit from "./meeting-exit";

// mediasoup params
let params = {
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
    const [device, setDevice] = useState<mediasoupClient.Device | null>(null);

    // Producer Transport
    const [senderTransport, setSenderTransport] =
        useState<mediasoupClient.types.Transport | null>(null);

    // ReciverTransport
    const [recvTransport, setRecvTransport] =
        useState<mediasoupClient.types.Transport | null>(null);

    const [consumerParams, setConsumerParams] = useState<any | null>(null);

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
        async function joinRoom() {
            try {
                socket.emit(
                    "joinRoom",
                    { roomId },
                    async (
                        rtpCapabilities: mediasoupClient.types.RtpCapabilities,
                        existingPeer: any
                    ) => {
                        const newDevice = new mediasoupClient.Device();
                        await newDevice.load({ routerRtpCapabilities: rtpCapabilities });
                        setDevice(newDevice);

                        console.log(existingPeer);
                    }
                );
            } catch (err) {
                console.log(err);
            }
        }

        if (isJoined) joinRoom();
    }, [isJoined]);

    // Create webrtc transports (both producer and consumer), also listen for new producer =====================
    useEffect(() => {
        const startCall = async () => {
            try {
                // Create transport
                socket.emit(
                    "createWebRtcTransport",
                    { sender: true, roomId },
                    ({ params }: any) => {
                        if (params.err) {
                            console.log(params.err);
                            return;
                        }

                        if (!device) return;

                        // create producer transport
                        const producerTransport = device.createSendTransport(params);

                        if (!producerTransport) return;

                        setSenderTransport(producerTransport); // Update state

                        // Connect transport - will trigger, when produce() method in producerTransport calls
                        producerTransport.on(
                            "connect",
                            ({ dtlsParameters }, callback, errback) => {
                                try {
                                    socket.emit("connectTransport", {
                                        roomId,
                                        transportId: producerTransport.id,
                                        dtlsParameters,
                                    });

                                    callback(); // Notify parameters are transmitted
                                } catch (err: any) {
                                    console.log(err);
                                    errback(err);
                                }
                            }
                        );

                        // Produce transport - will trigger, when produce() method at server side called
                        producerTransport.on(
                            "produce",
                            async (parameters, callback, errback) => {
                                try {
                                    const muteState =
                                        parameters.kind === "audio"
                                            ? { isAudioMute: isAudioMute ?? false }
                                            : { isVideoMute: isVideoMute ?? false };

                                    socket.emit(
                                        "produceTransport",
                                        {
                                            roomId,
                                            transportId: producerTransport.id,
                                            kind: parameters.kind,
                                            rtpParameters: parameters.rtpParameters,
                                            ...muteState,
                                        },
                                        ({ producerId }: { producerId: string }) => {
                                            callback({ id: producerId }); // Notify parameters are transmitted
                                            // and got the producer id
                                        }
                                    );
                                } catch (err: any) {
                                    errback(err);
                                }
                            }
                        );
                    }
                );

                // New producer
                socket.on(
                    "newProducer",
                    async ({ producerId, kind, appData, socketId }) => {
                        if (!device) return;

                        // Create transport
                        socket.emit(
                            "createWebRtcTransport",
                            { sender: false, roomId },
                            ({ params }: any) => {
                                if (params.err) {
                                    console.log(params.err);
                                    return;
                                }

                                if (!device) return;

                                // create consumer transport
                                const consumerTransport = device.createRecvTransport(params);
                                if (!consumerTransport) return;

                                setRecvTransport(consumerTransport); // Update state
                                setConsumerParams({ producerId, kind, appData, socketId }); // Update params

                                // Connect transport - will trigger when consume() at server side called
                                consumerTransport.on(
                                    "connect",
                                    ({ dtlsParameters }, callback, errback) => {
                                        try {
                                            socket.emit("connectTransport", {
                                                roomId,
                                                transportId: consumerTransport.id,
                                                dtlsParameters,
                                            });

                                            callback(); // Notify parameters are transmitted
                                        } catch (err: any) {
                                            console.log(err);
                                            errback(err);
                                        }
                                    }
                                );
                            }
                        );
                    }
                );
            } catch (err: unknown) {
                console.log(err);
            }
        };

        device && startCall();
    }, [device]);

    // Connect webrtc produce tranport ==========================================================================
    useEffect(() => {
        const connectProducerTransport = async () => {
            try {
                if (!stream) return;

                // Get video & audio tracks
                const videoTrack = stream.getVideoTracks()[0];
                const audioTrack = stream.getAudioTracks()[0];

                // Produce video
                if (videoTrack) {
                    const videoProducer = await senderTransport?.produce({
                        encodings: params.encodings,
                        codecOptions: params.codecOptions,
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
                    const audioProducer = await senderTransport?.produce({
                        encodings: params.audioEncodings,
                        codecOptions: params.codecOptionsAudio,
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

        senderTransport && connectProducerTransport();
    }, [senderTransport]);

    // Connect webrtc consumer transport ========================================================================
    useEffect(() => {
        const connectConsumerTransport = async () => {
            try {
                if (!device || !recvTransport || !senderTransport) return;

                // Consume media
                socket.emit(
                    "consume",
                    {
                        roomId,
                        transportId: recvTransport.id,
                        producerId: consumerParams.producerId,
                        rtpCapabilities: device.rtpCapabilities,
                        appData: consumerParams.appData,
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
                            const existingPeer = prevPeers[consumerParams.socketId];

                            // Create a new stream if not exists, otherwise  add track to it
                            const newStream = existingPeer
                                ? new MediaStream(existingPeer.media.getTracks())
                                : new MediaStream();

                            newStream.addTrack(track);

                            // console.log(consumerParams.appData);

                            return {
                                ...prevPeers,
                                [consumerParams.socketId]: {
                                    media: newStream,
                                    isVideoMute:
                                        consumerParams.appData.isVideoMute ??
                                        existingPeer?.isVideoMute ??
                                        false,
                                    isAudioMute:
                                        consumerParams.appData.isAudioMute ??
                                        existingPeer?.isAudioMute ??
                                        false,
                                },
                            };
                        });
                    }
                );
            } catch (err: unknown) {
                console.log(err);
            }
        };

        recvTransport && consumerParams && connectConsumerTransport();
    }, [recvTransport, consumerParams]);

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
                        setDevice={setDevice}
                        setJoined={setJoined}
                        setMeetLeft={setMeetLeft}
                    />
                )}
            </div>
        </div>
    );
}

export default Meet;
