import React, { useContext, useEffect } from "react";
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Phone,
    Loader2,
    Hand,
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { IUserContext, UserContext } from "@/context/user-context";
import VideoCard from "./peer-video";

// Interface for props
interface PropsType {
    isVideoMute: boolean;
    isAudioMute: boolean;
    isVideoLoading: boolean;
    setVideoLoading: React.Dispatch<React.SetStateAction<boolean>>;
    videoRef: React.MutableRefObject<HTMLVideoElement | null>;
    stream: MediaStream | null;
    handleVideo: () => void;
    handleAudio: () => void;
    peers: {
        [key: string]: MediaStream;
    };
}

// Video Call Component
function OnVideoCall({
    isVideoMute,
    isAudioMute,
    isVideoLoading,
    setVideoLoading,
    videoRef,
    stream,
    handleVideo,
    handleAudio,
    peers,
}: PropsType) {
    // User context
    const { user } = useContext(UserContext) as IUserContext;


    

    // const [participants, setParticipants] = useState([
    //     {
    //         id: user?._id,
    //         name: "You (Host)",
    //         isHost: true,
    //         video: true,
    //         audio: true,
    //         isPinned: false,
    //     },
    //     {
    //         id: 2,
    //         name: "Ajmal",
    //         isHost: false,
    //         video: true,
    //         audio: true,
    //         isPinned: false,
    //     },
    // ]);

    // Set localstream when component mounts
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, []);

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
           bg-background border rounded-2xl shadow-custom relative p-2 "
            >
                {/* Video Grid */}
                <div className={`grid ${getGridClass()} gap-2 w-full h-full`}>
                    {/* Local video */}
                    <div
                        key={user?._id}
                        className="relative aspect-video flex items-center justify-center w-full h-full
                            bg-sidebar dark:bg-sidebar-backgroundDark rounded-2xl overflow-hidden"
                    >
                        {/* User Video or Avatar */}
                        {isVideoMute ? (
                            // Muted
                            <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-sidebar-backgroundDark">
                                <Avatar className="h-24 w-24">
                                    <AvatarFallback className="bg-zinc-300 dark:bg-muted font-semibold text-black dark:text-white text-2xl">
                                        {user?.name[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        ) : (
                            // Unmuted
                            <div className="relative w-full h-full">
                                {/* Loader */}
                                {isVideoLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-sidebar dark:bg-sidebar-backgroundDark">
                                        <Loader2 className="animate-spin w-12 h-12 text-white" />
                                    </div>
                                )}

                                {/* Video */}
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    onLoadedMetadata={() => setVideoLoading(true)}
                                    className="w-full h-full object-cover transform scale-x-[-1]"
                                />
                            </div>
                        )}

                        <div className="w-full absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center">
                            <div className="p-1 px-3 flex items-center gap-2 bg-black/30 backdrop-blur-sm text-white rounded-lg text-sm font-medium">
                                <span>{user?.name}</span>
                                {/* {participant.isHost && (
                                        <Shield className="h-4 w-4 text-white" />
                                    )} */}
                            </div>
                            {true && (
                                <div className="p-2 bg-black/30 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                                    <MicOff className="h-4 w-4 text-white" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Remote videos */}
                    {Object.entries(peers).map(([socketId]) => (
                        <VideoCard socketId={socketId} media={peers[socketId]} />
                    ))}
                </div>
            </div>

            {/* Control Bar */}
            <div className="flex items-center justify-center gap-3">
                <div className="flex items-center justify-center gap-3 p-2 bg-zinc-200 dark:bg-sidebar-backgroundDark backdrop-blur-sm rounded-full">
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
                            <div className="p-3 rounded-full bg-black/30 dark:bg-muted">
                                <Mic className="w-5 h-5 text-white" />
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
                            <div className="p-3 rounded-full bg-black/30 dark:bg-muted">
                                <Video className="w-5 h-5 text-white" />
                            </div>
                        )}
                    </motion.div>

                    {/* Screen share */}
                    <motion.div
                        className="flex items-center justify-center cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="p-3 rounded-full bg-black/30 dark:bg-muted">
                            <Hand className="w-5 h-5 text-white" />
                        </div>
                    </motion.div>

                    {/* End meet */}
                    <motion.div
                        className="flex items-center justify-center cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="p-3 rounded-full bg-red-600/80">
                            <Phone className="w-5 h-5 text-white" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default OnVideoCall;
