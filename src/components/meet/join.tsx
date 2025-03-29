import { motion } from "framer-motion";
import Navbar from "../common/navbar/navbar";
import { Loader2, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Button } from "../ui/button";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { IUserContext, UserContext } from "@/context/user-context";

// Video call Component
function JoinMeet() {
    // User context
    const { user } = useContext(UserContext) as IUserContext;

    const [isVideoLoading, setVideoLoading] = useState(true);

    // Stream
    const [stream, setStream] = useState<MediaStream | null>(null);

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

            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Stop webcam
    const stopWebcam = async () => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = null;
            stream.getVideoTracks().forEach((track) => track.stop()); // Stop camera

            // New stream with only audio
            const audioOnlyStream = new MediaStream(stream.getAudioTracks());

            // Update stream
            setStream(audioOnlyStream);
        }
    };

    // Handle video
    const handleVideo = () => {
        if (stream) {
            if (isVideoMute) {
                startWebcam(); // Start
            } else {
                stopWebcam(); // Stop
            }

            // Update state and localstorage
            setVideoMute((prev) => !prev);
            localStorage.setItem("isVideoMute", isVideoMute ? "0" : "1");
        }
    };

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
            if (stream) stream.getTracks().forEach((track) => track.stop());
        };
    }, []);

    return (
        <div className="h-screen dotted-bg">
            <div className="flex flex-col h-full relative transition-all">
                {/* Navbar */}
                <Navbar />

                {/* Content */}
                <div className="flex-1 flex flex-col md:flex-row p-10 md:p-20 md:px-10 lg:p-20 lg:px-10 gap-6 max-w-7xl mx-auto w-full">
                    {/* Video Preview */}
                    <motion.div
                        className="flex-1 aspect-video p-0 relative rounded-2xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {isVideoMute ? (
                            // Muted
                            <div className="w-full h-full flex items-center justify-center bg-sidebar dark:bg-sidebar-backgroundDark">
                                <Avatar className="h-24 w-24">
                                    <AvatarFallback className="bg-zinc-800 dark:bg-muted text-white text-2xl">
                                        {user?.name?.[0]?.toUpperCase()}
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

                        {/* User name */}
                        <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium">
                            {user?.name}
                        </div>

                        {/* Buttons */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 bg-black/30 backdrop-blur-sm rounded-full">
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
                                    <div className="p-3 rounded-full bg-black/30">
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
                                    <div className="p-3 rounded-full bg-black/30">
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
                        className="md:w-80 space-y-6 flex flex-col items-center justify-center"
                    >
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-medium text-foreground">
                                Ready to join?
                            </h2>
                        </div>

                        <p className="text-muted-foreground">No one else is here</p>

                        <Button className="h-11 w-60 shadow-md disabled:cursor-not-allowed rounded-full">
                            Join now
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default JoinMeet;
