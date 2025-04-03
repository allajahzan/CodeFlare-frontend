import { motion } from "framer-motion";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useContext, useLayoutEffect } from "react";
import { IUserContext, UserContext } from "@/context/user-context";
import React from "react";

// Interface for Props
interface PropsType {
    isVideoMute: boolean;
    isAudioMute: boolean;
    videoRef: React.MutableRefObject<HTMLVideoElement | null>;
    setJoined: React.Dispatch<React.SetStateAction<boolean>>;
    handleVideo: () => void;
    handleAudio: () => void;
    stream: MediaStream | null;
    setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
}

// Join video call Component
function JoinMeeting({
    isAudioMute,
    isVideoMute,
    videoRef,
    setJoined,
    handleAudio,
    handleVideo,
    stream,
    setStream,
}: PropsType) {
    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Start web cam
    const startWebcam = async () => {
        try {
            let newStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            // Update stream
            setTimeout(() => {
                setStream(newStream);
            }, 0);
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

    return (
        <div className="flex-1 flex flex-col md:flex-row p-8 sm:p-10 md:p-20 md:px-10 lg:p-20 lg:px-10 gap-6 max-w-7xl mx-auto w-full">
            {/* Video Preview */}
            <motion.div
                className="flex-1 aspect-video p-2 relative rounded-2xl overflow-hidden bg-background border shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <div
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
                                <AvatarFallback className="bg-zinc-800 dark:bg-muted text-white text-2xl font-semibold">
                                    {user?.profilePic ? (
                                        <img src={user.profilePic} />
                                    ) : (
                                        user?.name?.[0]?.toUpperCase()
                                    )}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    )}
                </div>

                {/* User name */}
                <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium">
                    {user?.name}
                </div>

                {/* Buttons */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-0 bg-transparent rounded-full">
                    {/* Audio toggle */}
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
                            <div className="p-3 rounded-full bg-black/40">
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
                            <div className="p-3 rounded-full bg-black/40">
                                <Video className="w-5 h-5 text-white" />
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>

            {/* Join Options */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="md:w-80 space-y-3 flex flex-col items-center justify-center"
            >
                <h2 className="text-2xl font-medium text-foreground">Ready to join?</h2>

                <p className="text-muted-foreground">No one else is here</p>

                <Button
                    onClick={() => setJoined(true)}
                    className="h-11 w-24 shadow-md disabled:cursor-not-allowed rounded-full"
                >
                    Join now
                </Button>
            </motion.div>
        </div>
    );
}

export default React.memo(JoinMeeting);
