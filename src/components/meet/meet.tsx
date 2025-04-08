import Navbar from "../common/navbar/navbar";
import { useCallback, useEffect, useRef, useState } from "react";
import * as mediasoupClient from "mediasoup-client";
import { socket } from "@/socket/communication/connect";
import MeetingJoin, { IMeet } from "./meeting-join";
import MeetingRoom from "./meeting-room";
import { useLocation } from "react-router-dom";
import MeetingLeft from "./meeting-left";
import {
    createTransport,
    joinRoom,
    leaveMeet,
    onNewProducer,
    onPeerLeft,
    onPeerMuteChange,
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
    // ===================================== Initial streaming setup ===================================

    const roomId = useLocation().pathname.split("/")[3];

    // Stream ref
    const streamRef = useRef<MediaStream | null>(null);

    // Video ref
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [isJoined, setJoined] = useState<boolean | null>(false);
    const [isMeetLeft, setMeetLeft] = useState<boolean>(false);
    const [meet, setMeet] = useState<IMeet | null>(null);

    // Start web cam
    const startWebcam = async () => {
        try {
            let newStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            // Update stream
            streamRef.current = newStream;

            if (videoRef.current) {
                videoRef.current.srcObject = streamRef.current;
                videoRef.current.play().catch((err) => console.log(err));
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Stop webcam
    const stopWebcam = useCallback(() => {
        const currentStream = streamRef.current;

        if (currentStream) {
            currentStream.getTracks().forEach((track) => track.stop());
            streamRef.current = null;

            // Leave call
            leaveCall();
        }
    }, []);

    // leave call
    const leaveCall = () => {
        leaveMeet(roomId);
    };

    // when page unmount stop webcam
    useEffect(() => {
        return () => {
            stopWebcam();
        };
    }, []);

    // =========================================== Mute/unmute ==========================================

    // Mute-unmute states
    const [isAudioMute, setAudioMute] = useState<boolean>(false);
    const [isVideoMute, setVideoMute] = useState<boolean>(false);

    // Handle video
    const handleVideo = useCallback(() => {
        if (streamRef.current) {
            const videoTrack = streamRef.current.getVideoTracks()[0]; // Get video track

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
    }, [socket, roomId, isJoined]);

    // Handle audio
    const handleAudio = useCallback(() => {
        if (streamRef.current) {
            const audioTrack = streamRef.current.getAudioTracks()[0]; // Get audio track
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
    }, [socket, roomId, isJoined]);

    // Listen mute unmute changes
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
            setPeers((prevPeers) => {
                if (!prevPeers[socketId]) return prevPeers;

                return {
                    ...prevPeers,
                    [socketId]: {
                        ...prevPeers[socketId],
                        [`is${type === "video" ? "Video" : "Audio"}Mute`]: isMuted,
                    },
                };
            });
        };

        onPeerMuteChange(handlePeerMuteChange);

        return () => {
            socket.off("peerMuteChange", handlePeerMuteChange);
        };
    }, []);

    // ========================= WebRtc with socket IO and mediasoup ===========================================

    // Peers
    const [peers, setPeers] = useState<{
        [socketId: string]: {
            media: MediaStream;
            screen?: MediaStream;
            isVideoMute: boolean;
            isAudioMute: boolean;
        };
    }>({});

    // Device
    const deviceRef = useRef<mediasoupClient.Device | null>(null);

    // Join room and create device
    useEffect(() => {
        if (isJoined) {
            joinRoom(roomId, async (rtpCapabilities, existingProducers) => {
                // Create and load the device
                const newDevice = new mediasoupClient.Device();
                await newDevice.load({ routerRtpCapabilities: rtpCapabilities });

                // Update the device
                deviceRef.current = newDevice;

                // Consume all existing producers
                if (existingProducers && existingProducers.length > 0) {
                    await consumeExistingProducers(existingProducers);
                }

                // Create producer transport
                const sendTransport = await goCreateTransport(true);
                if (!sendTransport) return;

                if (!streamRef.current) return;

                // Get video & audio tracks
                const videoTrack = streamRef.current.getVideoTracks()[0];
                const audioTrack = streamRef.current.getAudioTracks()[0];

                // Connect and produce media
                connectAndProduceMedia(sendTransport, videoTrack, audioTrack, null);
            });
        }
    }, [isJoined]);

    // Listen for new producers
    useEffect(() => {
        onNewProducer(async ({ producerId, appData, socketId }) => {
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

    // Listen for peer left
    useEffect(() => {
        const handlePeerLeft = (socketId: string) => {
            setPeers((prevPeers) => {
                const updatedPeers = { ...prevPeers };
                delete updatedPeers[socketId]; // Remove the peer
                return updatedPeers;
            });
        };

        onPeerLeft(handlePeerLeft);

        return () => {
            socket.off("peerLeft", handlePeerLeft);
        };
    }, []);

    // Consume existing producers
    const consumeExistingProducers = async (
        existingProducers: {
            producerId: string;
            kind: mediasoupClient.types.MediaKind;
            appData: any;
            socketId: string;
        }[]
    ) => {
        // console.log("Consuming existing producers: ", existingProducers);

        for (const producer of existingProducers) {
            // Create receiver transport
            const recvTransport = await goCreateTransport(false);
            if (!recvTransport) return;

            // Connect and consume media
            connectAndConsumeMedia(
                producer.producerId,
                producer.appData,
                producer.socketId,
                recvTransport
            );
        }
    };

    // Create webrtc transports (both producer and consumer), also listen for new producer
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
                console.log(err);
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
                    socket.emit(
                        "produceTransport",
                        {
                            roomId,
                            transportId: sendTransport.id,
                            kind: parameters.kind,
                            appData: parameters.appData,
                            rtpParameters: parameters.rtpParameters,
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
        sendTransport: mediasoupClient.types.Transport,
        videoTrack: MediaStreamTrack | null,
        audioTrack: MediaStreamTrack | null,
        screenTrack: MediaStreamTrack | null
    ) => {
        try {
            // Produce video
            if (videoTrack) {
                const videoProducer = await sendTransport?.produce({
                    encodings: trackParams.encodings,
                    codecOptions: trackParams.codecOptions,
                    track: videoTrack,
                    appData: { isVideoMute, kind: "video" },
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
                    appData: { isAudioMute, kind: "audio" },
                });

                audioProducer?.on("trackended", () => {
                    console.log("Audio track ended");
                });

                audioProducer?.on("transportclose", () => {
                    console.log("Audio transport ended");
                });
            }

            // Produce screen
            if (screenTrack) {
                const screenProducer = await sendTransport?.produce({
                    encodings: trackParams.encodings,
                    codecOptions: trackParams.codecOptions,
                    track: screenTrack,
                    appData: { kind: "screen" },
                });

                screenProducer?.on("trackended", () => {
                    console.log("screen track ended");
                });

                screenProducer?.on("transportclose", () => {
                    console.log("screen transport ended");
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
                } catch (err: any) {
                    console.log(err);
                    errback(err);
                }
            });
        } catch (err: unknown) {
            console.log(err);
        }
    };

    useEffect(() => {
        console.log(peers);
    }, [peers]);

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

                    // console.log(params.appData);

                    if (!consumer) return;

                    const { track } = consumer;
                    const kind = params.appData.kind; // Type of track

                    console.log(kind);

                    // Resume consumer
                    socket.emit(
                        "resumeConsumer",
                        { roomId, consumerId: consumer.id },
                        ({ params }: any) => {
                            console.log(params.success);
                        }
                    );

                    // Update peers
                    setPeers((prevPeers) => {
                        const existingPeer = prevPeers[socketId] || {};

                        // Audio or video stream
                        let updatedMediaStream = existingPeer.media
                            ? new MediaStream(existingPeer.media.getTracks())
                            : new MediaStream();

                        // Screen stream
                        let updatedScreenStream = existingPeer.screen
                            ? new MediaStream()
                            : undefined;

                        if (kind === "audio" || kind === "video") {
                            updatedMediaStream.addTrack(track);
                        } else if (kind === "screen") {
                            updatedScreenStream = updatedScreenStream || new MediaStream();
                            updatedScreenStream.addTrack(track);
                        } else {
                            console.warn("Unknown kind:", kind);
                            return prevPeers;
                        }

                        return {
                            ...prevPeers,
                            [socketId]: {
                                ...existingPeer,
                                media: updatedMediaStream,
                                screen: updatedScreenStream,
                                isVideoMute:
                                    appData.isVideoMute ?? existingPeer.isVideoMute ?? false,
                                isAudioMute:
                                    appData.isAudioMute ?? existingPeer.isAudioMute ?? false,
                            },
                        };
                    });
                }
            );
        } catch (err: unknown) {
            console.log(err);
        }
    };

    return (
        <div className="h-screen dotted-b">
            <div className="flex flex-col h-full w-full relative transition-all">
                {/* Navbar */}
                {true && <Navbar />}

                {/* Meeting join */}
                {isJoined === false && (
                    <MeetingJoin
                        videoRef={videoRef}
                        setJoined={setJoined}
                        isVideoMute={isVideoMute}
                        isAudioMute={isAudioMute}
                        handleVideo={handleVideo}
                        handleAudio={handleAudio}
                        startWebcam={startWebcam}
                        streamRef={streamRef}
                        meet={meet as IMeet}
                        setMeet={setMeet}
                    />
                )}

                {/* Meeting room */}
                {isJoined === true && (
                    <div className="flex-1 overflow-hidden">
                        <MeetingRoom
                            isVideoMute={isVideoMute}
                            isAudioMute={isAudioMute}
                            videoRef={videoRef}
                            streamRef={streamRef}
                            handleVideo={handleVideo}
                            handleAudio={handleAudio}
                            peers={peers}
                            setMeetLeft={setMeetLeft}
                            setJoined={setJoined}
                            goCreateTransport={goCreateTransport}
                            connectAndProduceMedia={connectAndProduceMedia}
                        />
                    </div>
                )}

                {/* Meeting left */}
                {isMeetLeft && (
                    <MeetingLeft
                        setJoined={setJoined}
                        setMeetLeft={setMeetLeft}
                        setAudioMute={setAudioMute}
                        setVideoMute={setVideoMute}
                        startWebcam={startWebcam}
                    />
                )}
            </div>
        </div>
    );
}

export default Meet;
