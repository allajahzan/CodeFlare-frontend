import { motion } from "framer-motion";
import { Ellipsis, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Fragment, useContext, useEffect, useState } from "react";
import { IUserContext, UserContext } from "@/context/user-context";
import React from "react";
import { fetchData } from "@/service/api-service";
import ApiEndpoints from "@/constants/api-endpoints";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { Link, useLocation } from "react-router-dom";
import { IUser } from "@/types/attendence";
import profile from "@/assets/images/no-profile.svg";

// Interface for Message
export interface IMessage {
    userId: string;
    message: string;
    createdAt: Date;
}

// Interface for Meet
export interface IMeet {
    _id: string;
    roomId: string;
    hostId: string;
    host: IUser;
    invitedUsers: IUser[];
    messages: IMessage[];
}

// Interface for Props
interface PropsType {
    isVideoMute: boolean;
    isAudioMute: boolean;
    videoRef: React.MutableRefObject<HTMLVideoElement | null>;
    setJoined: React.Dispatch<React.SetStateAction<boolean | null>>;
    handleVideo: () => void;
    handleAudio: () => void;
    startWebcam : ()=>void;
    streamRef: React.MutableRefObject<MediaStream | null>;
    meet: IMeet;
    setMeet: React.Dispatch<React.SetStateAction<IMeet | null>>;
}

// Join video call Component
function MeetingJoin({
    isAudioMute,
    isVideoMute,
    videoRef,
    setJoined,
    handleAudio,
    handleVideo,
    startWebcam,
    streamRef,
    meet,
    setMeet,
}: PropsType) {
    // Meet
    const [isVerified, setVerified] = useState<boolean | null>(null);

    // Redux
    const role = useSelector((state: stateType) => state.role);

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Path
    const path = useLocation();

    const roomId = path.pathname.split("/")[3];

    // Start webcam when page load
    useEffect(() => {
        localStorage.setItem("isVideoMute", "0");
        localStorage.setItem("isAudioMute", "0");

        if(isVerified){
            console.log("starting camera")
            startWebcam();
        }
    }, [isVerified]);

    // Handle local video streaming on video mute and unmute
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = streamRef.current;
            videoRef.current.play().catch((err) => console.log(err));
        }
    }, [isVideoMute]);

    // Check room exists or not
    useEffect(() => {
        const checkRoomId = async () => {
            try {
                // Send request
                const resp = await fetchData(
                    ApiEndpoints.MEET + `?roomId=${roomId}`,
                    role
                );

                // Success response
                if (resp && resp.status === 200) {
                    const data = resp.data?.data;

                    setTimeout(() => {
                        setMeet(data);
                        setVerified(true);
                    }, 1000);
                }
            } catch (err: unknown) {
                setVerified(false);
            }
        };

        checkRoomId();
    }, []);

    return (
        <Fragment>
            {/* If Verified */}
            {isVerified === true && (
                <div className="flex-1 flex flex-col md:flex-row p-8 sm:p-10 md:p-20 md:px-10 lg:p-20 lg:px-10 gap-6 max-w-7xl mx-auto w-full">
                    {/* Video Preview */}
                    <motion.div
                        className="flex-1 aspect-video p-2 relative rounded-2xl overflow-hidden bg-background border shadow-custom"
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
                        {/* Host details */}
                        {user?._id === meet.host?._id ? (
                            <p className="text-foreground font-medium text-base">
                                You (Host)
                            </p>
                        ) : (
                            <>
                                <p className="text-foreground font-medium text-base">
                                    {meet.host.name} (Host)
                                </p>
                                <Avatar className="bg-background w-12 h-12 border-4 border-background dark:border-border shadow-md">
                                    <AvatarImage
                                        src={meet.host.profilePic || ""}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="bg-transparent">
                                        <img src={profile} alt="" />
                                    </AvatarFallback>
                                </Avatar>
                            </>
                        )}

                        <h2 className="text-2xl font-medium text-foreground">
                            Ready to join?
                        </h2>

                        {/* If no peers */}
                        {meet.invitedUsers.length === 0 && (
                            <p className="text-muted-foreground font-medium">
                                No one else is here
                            </p>
                        )}

                        {/* Peers */}
                        {meet.invitedUsers.length > 0 && (
                            <div className="flex items-center gap-1">
                                {meet.invitedUsers.slice(0, 4).map((peer, index) => (
                                    <Avatar
                                        key={index}
                                        className="bg-background w-12 h-12 border-4 border-background dark:border-border shadow-md"
                                    >
                                        <AvatarImage
                                            src={peer.profilePic || ""}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-transparent">
                                            <img src={profile} alt="" />
                                        </AvatarFallback>
                                    </Avatar>
                                ))}

                                {/* More icon - if more than 4 peers are there */}
                                {meet.invitedUsers.length > 4 && (
                                    <Ellipsis className="w-5 h-5 text-foreground" />
                                )}
                            </div>
                        )}

                        {/* Button */}
                        <Button
                            onClick={() => setJoined(true)}
                            className="h-11 w-24 shadow-md disabled:cursor-not-allowed rounded-full"
                        >
                            Join now
                        </Button>
                    </motion.div>
                </div>
            )}

            {/* If not verified */}
            {isVerified === false && (
                <div className="relative h-screen w-full z-0 flex flex-col items-center justify-center p-5 space-y-5">
                    <h1 className="text-center text-foreground font-bold text-2xl">
                        Sorry, this page isn't available.
                    </h1>
                    <p className="text-center text-foreground font-medium text-lg">
                        The link you followed may be broken, or the page may have been
                        removed.{" "}
                        <Link to={`/${role}/meet`} replace>
                            Go back
                        </Link>
                    </p>
                </div>
            )}

            {/* If isVerified is null */}
            {isVerified === null && (
                <div className="fixed z-50 inset-0 flex gap-2 items-center justify-center bg-black/90">
                    <p className="text-3xl text-white">Joining...</p>
                </div>
            )}
        </Fragment>
    );
}

export default React.memo(MeetingJoin);
