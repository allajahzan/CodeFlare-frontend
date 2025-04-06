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
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { IUserContext, UserContext } from "@/context/user-context";
import PeerVideo from "./peer-video";
import { socket } from "@/socket/communication/connect";
import { useLocation } from "react-router-dom";

// Interface for props
interface PropsType {
    isVideoMute: boolean;
    isAudioMute: boolean;
    videoRef: React.MutableRefObject<HTMLVideoElement | null>;
    stream: MediaStream | null;
    handleVideo: () => void;
    handleAudio: () => void;
    peers: {
        [socketId: string]: {
            media: MediaStream;
            isVideoMute: boolean;
            isAudioMute: boolean;
        };
    };
    setMeetLeft: React.Dispatch<React.SetStateAction<boolean>>;
    setJoined: React.Dispatch<React.SetStateAction<boolean | null>>;
}

// Video Call Component
function MeetingRoom({
    isVideoMute,
    isAudioMute,
    videoRef,
    stream,
    handleVideo,
    handleAudio,
    peers,
    setMeetLeft,
    setJoined,
}: PropsType) {
    const path = useLocation();

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Leaving
    const [isLeaving, setLeaving] = useState<boolean>(false);

    // Set localstream when component mounts
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, []);

    const roomId = path.pathname.split("/")[3];

    // Handle leave
    const handleLeave = () => {
        setLeaving(true);
        setTimeout(() => {
            leaveCall();
            setMeetLeft(true);
            setJoined(null);
        }, 1000);
    };

    // leave call
    const leaveCall = () => {
        socket.emit("leaveCall", { roomId });
    };

    // When page refresh- - leave the call
    useEffect(() => {
        const handleBeforeUnload = () => {
            socket.emit("leaveCall", { roomId });
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [roomId]);

    const getGridClass = () => {
        const count = Object.keys(peers).length;
        if (count === 0) return "grid-cols-1";
        if (count === 1) return "grid-cols-2";
        if (count === 2) return "grid-cols-2";
        if (count === 3) return "grid-cols-2";
        if (count <= 4) return "grid-cols-1 md:grid-cols-2";
        if (count <= 6) return "grid-cols-2 md:grid-cols-3";
        if (count <= 9) return "grid-cols-2 md:grid-cols-3 lg:grid-cols-3";
        if (count <= 12) return "grid-cols-2 md:grid-cols-4 lg:grid-cols-4";
        if (count <= 16)
            return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6";
        if (count <= 20)
            return "grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6";
        if (count <= 25)
            return "grid-cols-2 sm:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6";
        if (count <= 32)
            return "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6";
        return "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6"; // For more than 32 users
    };

    return (
        <div className="flex flex-col gap-5 items-center justify-center h-screen p-5">
            {/* Main Content */}
            <div
                className="flex-1 flex flex-col items-center justify-center overflow-hidden
           bg-background border rounded-2xl shadow-lg relative p-2 "
            >
                {/* Video Grid */}
                <div className={`grid ${getGridClass()} gap-2 w-full h-full`}>
                    {/* Local video */}
                    <div
                        key={user?._id}
                        className="relative aspect-video flex items-center justify-center w-full h-full
                           bg-zinc-200 dark:bg-sidebar-backgroundDark rounded-xl overflow-hidden"
                    >
                        {/* Unmuted */}
                        {!isVideoMute && (
                            <div className="relative w-full h-full">
                                {/* Video */}
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className={`w-full h-full object-cover transform scale-x-[-1]`}
                                />
                            </div>
                        )}

                        {/* Muted */}
                        {isVideoMute && (
                            // Fallback
                            <div className="flex items-center justify-center bg-zinc-200 dark:bg-sidebar-backgroundDark">
                                <Avatar className="h-24 w-24">
                                    <AvatarFallback className="bg-zinc-300 dark:bg-muted text-foreground text-2xl font-semibold">
                                        {user?.profilePic ? (
                                            <img src={user.profilePic} />
                                        ) : (
                                            user?.name?.[0]?.toUpperCase()
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        )}

                        {/* Name and mic icon */}
                        <div className="w-full absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center">
                            <div className="p-1 px-3 flex items-center gap-2 bg-black/30 backdrop-blur-sm text-white rounded-lg text-sm font-medium">
                                <span>{user?.name}</span>
                                {/* {participant.isHost && (
                                        <Shield className="h-4 w-4 text-white" />
                                    )} */}
                            </div>

                            {/* Audio Icon */}
                            <div className="p-2 bg-black/30 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                                {isAudioMute ? (
                                    <MicOff className="h-4 w-4 text-red-600" />
                                ) : (
                                    <Mic className="h-4 w-4 text-white" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Remote videos - peers */}
                    {Object.entries(peers).map(([socketId, peer]) => (
                        <PeerVideo
                            key={socketId}
                            socketId={socketId}
                            media={peer.media}
                            isVideoMute={peer.isVideoMute}
                            isAudioMute={peer.isAudioMute}
                        />
                    ))}
                </div>
            </div>

            {/* Control Bar */}
            <div className="flex items-center justify-center gap-3">
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
                        className="flex items-center justify-center cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="p-3 rounded-full bg-muted">
                            <ScreenShare className="w-5 h-5 text-foreground" />
                        </div>
                    </motion.div>

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
                <div className="fixed z-50 inset-0 flex gap-2 items-center justify-center bg-black/80">
                    <p className="text-3xl text-white">Leaving...</p>
                </div>
            )}
        </div>
    );
}

export default MeetingRoom;
