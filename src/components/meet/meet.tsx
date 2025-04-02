import Navbar from "../common/navbar/navbar";
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import * as mediasoupClient from "mediasoup-client";
import { socket } from "@/socket/communication/connect";
import JoinVideoCall from "./join-meeting";
import OnVideoCall from "./meeting-room";

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
    const [isJoined, setJoined] = useState<boolean>(false);

    // Stream
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isVideoLoading, setVideoLoading] = useState<boolean>(true);

    // Video ref
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Mute-unmute states
    const [isAudioMute, setAudioMute] = useState<boolean>(false);
    const [isVideoMute, setVideoMute] = useState<boolean>(false);

    // Start webcam
    const startWebcam = async () => {
        try {
            let newStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            // Update stream
            setStream(newStream);

            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;
                }
            }, 500);
        } catch (err) {
            console.log(err);
        }
    };

    // Stop webcam
    const stopWebcam = async () => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = null;
            stream.getTracks().forEach((track) => track.stop()); // Stop camera

            // Update stream
            setStream(null);
        }
    };

    // Handle video
    const handleVideo = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0]; // Get video track

            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled; // Enable-Disable

                // Update state and localStorage
                setVideoMute((prev) => !prev);
                localStorage.setItem("isVideoMute", isVideoMute ? "0" : "1");
            }
        }
    };

    // Handle state - isVideoMute
    useEffect(() => {
        if (!isVideoMute && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch((err) => console.log(err));
        }
    }, [isVideoMute, stream]);

    // Handle audio
    const handleAudio = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled; // Enable-Disable

                // Update state and localstorage
                setAudioMute((prev) => !prev);
                localStorage.setItem("isAudioMute", isAudioMute ? "0" : "1");
            }
        }
    };

    // Start webcam when page load
    useLayoutEffect(() => {
        localStorage.setItem("isVideoMute", "0");
        localStorage.setItem("isAudioMute", "0");

        startWebcam();

        // Clean up
        return () => {
            stopWebcam();
        };
    }, []);

    // ========================= WebRtc with socket IO and mediasoup ===========================================

    const roomId = "room-123";

    // Peers
    const [peers, setPeers] = useState<{ [key: string]: MediaStream }>({});

    // Device
    const [device, setDevice] = useState<mediasoupClient.Device | null>(null);

    // Producer Transport
    const [senderTransport, setSenderTransport] =
        useState<mediasoupClient.types.Transport | null>(null);

    // ReciverTransport
    const [recvTransport, setRecvTransport] =
        useState<mediasoupClient.types.Transport | null>(null);

    const [consumerParams, setConsumerParams] = useState<any | null>(null);

    // Join room and create device =============================================================================
    useEffect(() => {
        async function joinRoom() {
            try {
                socket.emit(
                    "joinRoom",
                    { roomId },
                    async (rtpCapabilities: mediasoupClient.types.RtpCapabilities) => {
                        console.log("joined room");
                        const newDevice = new mediasoupClient.Device();
                        await newDevice.load({ routerRtpCapabilities: rtpCapabilities });
                        setDevice(newDevice);
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
                            console.log("create webrtc transport failed", params.err);
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
                                    console.log("produceTransport connect event");

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

                        // Produce transport - will trigger, when produce() method in producerTransport calls
                        producerTransport.on(
                            "produce",
                            async (parameters, callback, errback) => {
                                try {
                                    console.log("produceTransport produce event");

                                    socket.emit(
                                        "produceTransport",
                                        {
                                            roomId,
                                            transportId: producerTransport.id,
                                            kind: parameters.kind,
                                            rtpParameters: parameters.rtpParameters,
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
                socket.on("newProducer", async ({ producerId, kind, socketId }) => {
                    console.log("new producer");
                    console.log(producerId, kind, socketId);

                    if (!device) return;

                    // Create transport
                    socket.emit(
                        "createWebRtcTransport",
                        { sender: false, roomId },
                        ({ params }: any) => {
                            if (params.err) {
                                console.log("create webrtc transport failed", params.err);
                                return;
                            }

                            if (!device) return;

                            // create consumer transport
                            const consumerTransport = device.createRecvTransport(params);

                            if (!consumerTransport) return;

                            setRecvTransport(consumerTransport); // Update state
                            setConsumerParams({ producerId, kind, socketId }); // Update params

                            // Connect transport -
                            consumerTransport.on(
                                "connect",
                                ({ dtlsParameters }, callback, errback) => {
                                    try {
                                        console.log("consumerTransport connect event");

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
                });
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

                socket.emit(
                    "consume",
                    {
                        roomId,
                        transportId: recvTransport.id,
                        producerId: consumerParams.producerId,
                        rtpCapabilities: device.rtpCapabilities,
                    },
                    async ({ params }: any) => {
                        if (params.err) {
                            console.log("Cannot consume", params.err);
                        }

                        const consumer = await recvTransport.consume({
                            id: params.id,
                            producerId: params.producerId,
                            kind: params.kind,
                            rtpParameters: params.rtpParameters,
                        });

                        if (!consumer) return;

                        const { track } = consumer; // track

                        // const remoteStream = new MediaStream([track]);
                        // With the above code we can't add track to existing stream
                        // It's set new track for streaming, even after mute and unmute
                        // So streaming might get stuck

                        // Resume the cosumer by emiting the event
                        socket.emit(
                            "resumeConsumer",
                            { roomId, consumerId: consumer.id },
                            ({ params }: any) => {
                                if (params.success) {
                                    console.log("successfully resumed");
                                } else {
                                    console.log("Failed to resume");
                                }
                            }
                        );

                        // Update peers with remote stream. if stream already exists, add new track to it.
                        setPeers((prevPeers) => {
                            const existingStream = prevPeers[consumerParams.socketId];

                            if (existingStream) {
                                // Replace track if stream already exists
                                const newStream = new MediaStream(existingStream.getTracks());
                                newStream.addTrack(track);
                                return {
                                    ...prevPeers,
                                    [consumerParams.socketId]: newStream, // Update stream with new track
                                };
                            } else {
                                // First time creating stream
                                return {
                                    ...prevPeers,
                                    [consumerParams.socketId]: new MediaStream([track]),
                                };
                            }
                        });
                    }
                );
            } catch (err: unknown) {
                console.log(err);
            }
        };

        recvTransport && consumerParams && connectConsumerTransport();
    }, [recvTransport, consumerParams]);

    // ==========================================================================================================

    return (
        <div className="h-screen dotted-bg">
            <div className="flex flex-col h-full w-full relative transition-all">
                {/* Navbar */}
                {!isJoined && <Navbar />}

                {/* Join video call */}
                {!isJoined && (
                    <JoinVideoCall
                        videoRef={videoRef}
                        setJoined={setJoined}
                        isVideoMute={isVideoMute}
                        isAudioMute={isAudioMute}
                        handleVideo={handleVideo}
                        handleAudio={handleAudio}
                    />
                )}

                {/* Video Component */}
                {isJoined && (
                    <OnVideoCall
                        isVideoMute={isVideoMute}
                        isAudioMute={isAudioMute}
                        isVideoLoading={isVideoLoading}
                        setVideoLoading={setVideoLoading}
                        videoRef={videoRef}
                        stream={stream}
                        handleVideo={handleVideo}
                        handleAudio={handleAudio}
                        peers={peers}
                    />
                )}
            </div>
        </div>
    );
}

export default Meet;
