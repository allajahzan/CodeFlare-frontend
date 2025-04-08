import React, { useContext, useEffect, useState } from "react";
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Phone,
    Hand,
    ScreenShare,
    MessageCircle,
    Grid2X2,
} from "lucide-react";
import { motion } from "framer-motion";
import { IUserContext, UserContext } from "@/context/user-context";
import PeerVideo from "./peer-video";
import { socket } from "@/socket/communication/connect";
import { useLocation } from "react-router-dom";
import { leaveMeet } from "@/socket/communication/videoCallSocket";
import * as mediasoupClient from "mediasoup-client";
import { IUser } from "@/types/attendence";

// Interface for props
interface PropsType {
    isVideoMute: boolean;
    isAudioMute: boolean;
    videoRef: React.MutableRefObject<HTMLVideoElement | null>;
    streamRef: React.MutableRefObject<MediaStream | null>;
    handleVideo: () => void;
    handleAudio: () => void;
    peers: {
        [socketId: string]: {
            media: MediaStream;
            screen?: MediaStream;
            isVideoMute: boolean;
            isAudioMute: boolean;
        };
    };
    setMeetLeft: React.Dispatch<React.SetStateAction<boolean>>;
    setJoined: React.Dispatch<React.SetStateAction<boolean | null>>;
    goCreateTransport: (
        sender: boolean
    ) => Promise<mediasoupClient.types.Transport | undefined>;
    connectAndProduceMedia: (
        sendTransport: mediasoupClient.types.Transport,
        videoTrack: MediaStreamTrack | null,
        audioTrack: MediaStreamTrack | null,
        screenTrack: MediaStreamTrack | null
    ) => Promise<void>;
}

// Video Call Component
function MeetingRoom({
    isVideoMute,
    isAudioMute,
    videoRef,
    streamRef,
    handleVideo,
    handleAudio,
    peers,
    setMeetLeft,
    setJoined,
    goCreateTransport,
    connectAndProduceMedia,
}: PropsType) {
    // Path
    const path = useLocation();

    const roomId = path.pathname.split("/")[3];

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Leaving
    const [isLeaving, setLeaving] = useState<boolean>(false);

    // Stop webcam
    const stopWebcam = async () => {
        if (streamRef.current && videoRef.current) {
            videoRef.current.srcObject = null;
            streamRef.current.getTracks().forEach((track) => track.stop()); // Stop camera

            // Update stream
            streamRef.current = null;
        }
    };

    // Handle leave
    const handleLeave = () => {
        setLeaving(true);
        setTimeout(() => {
            leaveCall(); //
            stopWebcam();
            setMeetLeft(true);
            setJoined(null);
        }, 1000);
    };

    // leave call
    const leaveCall = () => {
        leaveMeet(roomId);
    };

    // When page refresh - leave the call
    useEffect(() => {
        const handleBeforeUnload = () => {
            socket.emit("leaveCall", { roomId });
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [roomId]);

    // Set localstream when video mute unmute
    useEffect(() => {
        if (videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [isVideoMute]);

    // =========================================== Screen recording ==========================================

    // Start sharing
    async function startScreenSharing() {
        console.log("started screen sharing");

        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
        });

        const screenTrack = stream.getVideoTracks()[0];

        // Now i have to create tranpsort
        const sendTransport = await goCreateTransport(true);
        if (!sendTransport) return;

        // Connect and produce media
        connectAndProduceMedia(sendTransport, null, null, screenTrack);
    }

    const [pinnedUser, setPinnedUser] = useState<string | null>(
        socket.id as string
    );
    const [peerLayout, setPeerLayout] = useState<number>(1); // 1 or 2 per row

    const peersArray = Object.entries(peers);

    return (
        <div className="flex flex-col h-full">
            {/* Main Area */}
            <div
                className={`flex-1 ${peersArray.length === 0 && "flex items-center justify-center"
                    } overflow-hidden p-5 pt-0`}
            >
                <div
                    className={`grid grid-cols-${peersArray.length > 0 ? 3 : 1
                        } gap-2 h-full p-2 border rounded-2xl shadow-lg`}
                >
                    {/* Pinned video - initailly local stream*/}
                    {pinnedUser && pinnedUser === socket.id && (
                        <PeerVideo
                            key={socket.id}
                            socketId={socket.id as string}
                            media={streamRef.current}
                            screen={undefined}
                            isVideoMute={isVideoMute}
                            isAudioMute={isAudioMute}
                            setPinnedUser={setPinnedUser}
                            className="col-span-2"
                            videoElementClassName="transform scale-x-[-1]"
                            peer={user as unknown as IUser}
                        />
                    )}

                    {/* Pinned peer video */}
                    {pinnedUser &&
                        peersArray.map(([socketId, peer]) => {
                            if (socketId === pinnedUser) {
                                return (
                                    <PeerVideo
                                        key={socketId}
                                        socketId={socketId as string}
                                        media={peer.media}
                                        screen={peer.screen}
                                        isVideoMute={peer.isVideoMute}
                                        isAudioMute={peer.isAudioMute}
                                        setPinnedUser={setPinnedUser}
                                        className="col-span-2"
                                    />
                                );
                            }
                        })}

                    {/* Unpinned */}
                    {peers && peersArray.length > 0 && (
                        <div
                            className={`overflow-y-auto h-full w-full grid grid-cols-1 md:grid-cols-${peerLayout} gap-2`}
                        >
                            {/* Local stream unpinned */}
                            {pinnedUser && pinnedUser !== socket.id && (
                                <PeerVideo
                                    key={socket.id}
                                    socketId={socket.id as string}
                                    media={streamRef.current}
                                    screen={undefined}
                                    isVideoMute={isVideoMute}
                                    isAudioMute={isAudioMute}
                                    setPinnedUser={setPinnedUser}
                                    videoElementClassName="transform scale-x-[-1]"
                                    peer={user as unknown as IUser}
                                />
                            )}

                            {/* Peers videos unpinned*/}
                            {peersArray.length > 0 &&
                                peersArray.map(([socketId, peer]) => {
                                    if (pinnedUser !== socketId) {
                                        return (
                                            <PeerVideo
                                                key={socketId}
                                                socketId={socketId}
                                                media={peer.media}
                                                screen={peer.screen}
                                                isVideoMute={peer.isVideoMute}
                                                isAudioMute={peer.isAudioMute}
                                                setPinnedUser={setPinnedUser}
                                            />
                                        );
                                    }
                                })}
                        </div>
                    )}
                </div>
            </div>

            {/* Control Bar */}
            <div className="flex items-center justify-center gap-3 pb-5">
                <div className="flex items-center justify-center gap-3 p-2 bg-white border dark:bg-sidebar-backgroundDark shadow-md backdrop-blur-sm rounded-full">
                    <motion.div
                        className="flex items-center justify-center cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAudio}
                    >
                        {isAudioMute ? (
                            <div className="p-3 rounded-full bg-red-600/80">
                                <MicOff className="w-5 h-5 text-white" />
                            </div>
                        ) : (
                            <div className="p-3 rounded-full bg-muted">
                                <Mic className="w-5 h-5 text-foreground" />
                            </div>
                        )}
                    </motion.div>

                    {/* Video toggle  */}
                    <motion.div
                        className="flex items-center justify-center cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                        onClick={handleVideo}
                    >
                        {isVideoMute ? (
                            <div className="p-3 rounded-full bg-red-600/80">
                                <VideoOff className="w-5 h-5 text-white" />
                            </div>
                        ) : (
                            <div className="p-3 rounded-full bg-muted">
                                <Video className="w-5 h-5 text-foreground" />
                            </div>
                        )}
                    </motion.div>

                    {/* Hand rise */}
                    <motion.div
                        className="flex items-center justify-center cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="p-3 rounded-full bg-muted">
                            <Hand className="w-5 h-5 text-foreground" />
                        </div>
                    </motion.div>

                    {/* Screen share */}
                    <motion.div
                        onClick={startScreenSharing}
                        className="flex items-center justify-center cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="p-3 rounded-full bg-muted">
                            <ScreenShare className="w-5 h-5 text-foreground" />
                        </div>
                    </motion.div>

                    {/* Grid change */}
                    <motion.div
                        onClick={() =>
                            setPeerLayout(
                                peerLayout === 1 ? (peersArray.length > 2 ? 2 : 1) : 1
                            )
                        }
                        className="flex items-center justify-center cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="p-3 rounded-full bg-muted">
                            <Grid2X2 className="w-5 h-5 text-foreground" />
                        </div>
                    </motion.div>

                    {/* Message */}
                    <motion.div
                        className="flex items-center justify-center cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="p-3 rounded-full bg-muted">
                            <MessageCircle className="w-5 h-5 text-foreground" />
                        </div>
                    </motion.div>

                    {/* End meet */}
                    <motion.div
                        onClick={handleLeave}
                        className="flex items-center justify-center cursor-pointer "
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="p-3 rounded-full bg-red-600/80">
                            <Phone className="w-5 h-5 text-white" />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* When leaving meet */}
            {isLeaving && (
                <div className="fixed z-50 inset-0 flex gap-2 items-center justify-center bg-black/90">
                    <p className="text-3xl text-white">Leaving...</p>
                </div>
            )}
        </div>
    );
}

export default MeetingRoom;
