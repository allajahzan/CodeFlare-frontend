import { socket } from "@/socket/communication/connection";
import { handRaise, leaveMeet } from "@/socket/communication/videocall-Socket";
import { motion } from "framer-motion";
import {
    Hand,
    Mic,
    MicOff,
    Phone,
    Send,
    UsersRound,
    Video,
    VideoOff,
} from "lucide-react";
import * as mediasoupClient from "mediasoup-client";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PeerVideo from "./peer-video";
import { IUserContext, UserContext } from "@/context/user-context";
import { IUser } from "@/types/attendence";
import { cn } from "@/lib/utils";
import { IMeet } from "./meeting-join";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import profile from "@/assets/images/no-profile.svg";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import IconButton from "../ui/icon-button";

// Interface for Props
interface PropsType {
    isVideoMute: boolean;
    isAudioMute: boolean;
    videoRef: React.MutableRefObject<HTMLVideoElement | null>;
    streamRef: React.MutableRefObject<MediaStream | null>;
    handleVideo: () => void;
    handleAudio: () => void;
    peers: {
        [socketId: string]: {
            user: IUser;
            media: MediaStream;
            screen?: MediaStream;
            isVideoMute: boolean;
            isAudioMute: boolean;
            isHandRaised: boolean;
        };
    };
    setMeetLeft: React.Dispatch<React.SetStateAction<boolean>>;
    setJoined: React.Dispatch<React.SetStateAction<boolean | null>>;
    meet: IMeet | null;
    goCreateTransport: (
        sender: boolean
    ) => Promise<mediasoupClient.types.Transport | undefined>;
    connectAndProduceMedia: (
        sendTransport: mediasoupClient.types.Transport,
        videoTrack: MediaStreamTrack | null,
        audioTrack: MediaStreamTrack | null,
        screenTrack: MediaStreamTrack | null
    ) => Promise<void>;
    stopWebcam: () => void;
    isHandRaised: boolean;
    setHandRaised: React.Dispatch<React.SetStateAction<boolean>>;
}

// Meeting room Component
function MeetingRoom({
    handleAudio,
    handleVideo,
    isAudioMute,
    isVideoMute,
    setJoined,
    setMeetLeft,
    meet,
    streamRef,
    videoRef,
    stopWebcam,
    isHandRaised,
    setHandRaised,
    // connectAndProduceMedia,
    // goCreateTransport,
    peers,
}: PropsType) {
    // Path
    const path = useLocation();

    const roomId = path.pathname.split("/")[3];

    // Leaving
    const [isLeaving, setLeaving] = useState<boolean>(false);

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Selected peer
    const [selectedPeer, setSelectedPeer] = useState<string | undefined>(
        Object.entries(peers)?.[0]?.[0] || socket.id
    );

    // Self pinned
    const isPinnedSelf = selectedPeer === socket.id;

    // Peers list
    const [isPeersListOpen, setPeersList] = useState<boolean>(false);

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

    // Peers list open close
    useEffect(() => {
        if (Object.entries(peers).length === 1 && selectedPeer === socket.id) {
            setPeersList(true);
        }
    }, [peers, selectedPeer, socket.id]);

    // Emit hand raise event
    useEffect(() => {
        handRaise(roomId, isHandRaised, socket.id as string);
    }, [isHandRaised]);

    // Chat related states
    const [isChatOpen, setIsChatOpen] = useState(false);

    const chatMessages = [
        {
            id: 1,
            sender: "Jane Cooper",
            message: "Hi Team",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 2,
            sender: "Jack",
            message: "I share the main document",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: 3,
            sender: "Steven",
            message: "Hi Everyone! don't forget to make a note.",
            avatar: "/placeholder.svg?height=40&width=40",
        },
    ];

    return (
        <div className="flex flex-col h-full dark:bg-sidebar-background">
            {/* Content */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Left side peers list */}
                <div
                    className={cn(
                        "absolute top-0 left-0 z-50 h-full w-[300px] flex-col gap-5",
                        "bg-background dark:bg-sidebar border-r shadow overflow-y-auto overflow-x-hidden no-scrollbar",
                        "transform transition-transform duration-300 ease-in-out",
                        isPeersListOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    {/* Heading */}
                    <div className="w-full p-5 bg-background dark:bg-sidebar flex items-center justify-between gap-3 sticky top-0 z-[1000]">
                        <p className="text-lg text-foreground font-semibold">
                            Participants
                        </p>
                        <p className="text-lg text-foreground font-semibold">
                            ({Object.entries(peers).length})
                        </p>
                    </div>

                    {/* Separator */}
                    <Separator />

                    {/* Peers lists */}
                    <div className="w-full flex flex-col gap-5 p-5 items-center">
                        {/* Other peers */}
                        {Object.entries(peers).length > 0 &&
                            Object.entries(peers).map(([socketId, peer]) => {
                                if (socketId !== selectedPeer) {
                                    return (
                                        <PeerVideo
                                            key={socketId}
                                            socketId={socketId as string}
                                            peer={peer.user}
                                            media={peer.media}
                                            screen={peer.screen}
                                            isVideoMute={peer.isVideoMute}
                                            isAudioMute={peer.isAudioMute}
                                            isHandRaised={peer.isHandRaised}
                                            setPinnedUser={setSelectedPeer}
                                            pinnedUser={selectedPeer}
                                            meet={meet as IMeet}
                                            isOptionsShow={true}
                                            className="w-full"
                                        />
                                    );
                                }
                            })}
                    </div>
                </div>

                {/* Main videos */}
                <div
                    className={cn(
                        "h-full w-full relative p-5 dotted-bg bg-background dark:bg-sidebar-background",
                        "transition-all duration-300 ease-in-out",
                        // isPeersListOpen ? "ml-[300px]" : "ml-0"
                    )}
                >
                    <div className="h-full w-full flex items-center justify-center">
                        <div className="h-full md:h-fit w-full max-w-4xl rounded-2xl">
                            {/* Selected Peer view */}
                            {selectedPeer &&
                                Object.entries(peers).length > 0 &&
                                Object.entries(peers).map(([socketId, peer]) => {
                                    if (socketId === selectedPeer) {
                                        return (
                                            <PeerVideo
                                                key={socketId}
                                                socketId={socketId as string}
                                                peer={peer.user}
                                                media={peer.media}
                                                screen={peer.screen}
                                                isVideoMute={peer.isVideoMute}
                                                isAudioMute={peer.isAudioMute}
                                                isHandRaised={peer.isHandRaised}
                                                setPinnedUser={setSelectedPeer}
                                                pinnedUser={selectedPeer}
                                                meet={meet as IMeet}
                                                isOptionsShow={true}
                                                className="h-full w-full"
                                            />
                                        );
                                    }
                                })}

                            {/* Local stream - self view */}
                            {selectedPeer && (
                                <div
                                    className={cn(
                                        "transition-all duration-500 ease-in-out rounded-2xl",
                                        isPinnedSelf || Object.entries(peers).length === 0
                                            ? "h-full w-full"
                                            : "absolute bottom-8 md:bottom-5 right-8 md:right-5 w-60 sm:w-72 md:w-96 aspect-video rounded-2xl overflow-hidden shadow-md"
                                    )}
                                >
                                    <PeerVideo
                                        key={socket.id}
                                        socketId={socket.id as string}
                                        peer={user as unknown as IUser}
                                        media={streamRef.current}
                                        screen={undefined}
                                        isVideoMute={isVideoMute}
                                        isAudioMute={isAudioMute}
                                        isHandRaised={isHandRaised}
                                        setPinnedUser={setSelectedPeer}
                                        meet={meet as IMeet}
                                        isOptionsShow={false}
                                        className="h-full w-full"
                                        videoElementClassName="transform scale-x-[-1]"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chat panel */}
                <div
                    className={cn(
                        "h-full absolute w-[300px] z-[1000] top-0 right-0 border-l bg-background dark:bg-sidebar flex flex-col",
                        "transform transition-transform duration-300 ease-in-out",
                        isChatOpen ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    {/* Heading */}
                    <div className="flex items-center justify-between p-5 border-b ">
                        <h2 className="text-lg font-semibold text-foreground">Chat</h2>
                    </div>

                    {/* Message */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatMessages.map((message) => (
                            <div key={message.id} className="flex gap-3">
                                <Avatar className="bg-background w-12 h-12 border-2 border-background dark:border-border shadow-md">
                                    <AvatarImage
                                        // src={user?.profilePic}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="bg-transparent">
                                        <img className="w-full" src={profile} alt="" />
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <div className="text-sm font-medium text-foreground">
                                        {message.sender}
                                    </div>
                                    <div className="text-sm text-foreground">
                                        {message.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Button */}
                    <div className="p-4 border-t">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1 flex items-center">
                                <Input
                                    type="text"
                                    placeholder="Type a message"
                                    // value={message}
                                    // onChange={(event) => setMessage(event.target.value)}
                                    className="p-5 text-foreground font-medium rounded-lg shadow-sm"
                                />
                            </div>

                            {/* Button */}
                            <IconButton
                                Icon={Send}
                                className="bg-background dark:hover:bg-sidebar dark:hover:border-customBorder-dark"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Controle buttons */}
            <div className="relative border-t z-40 bg-background dark:bg-sidebar flex items-center justify-center gap-3 p-3">
                <div className="flex items-center justify-center gap-3 p-2  rounded-full">
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
                        <div
                            onClick={() => setHandRaised(!isHandRaised)}
                            className={`p-3 rounded-full ${isHandRaised
                                    ? "bg-zinc-200 text-black dark:bg-zinc-700 dark:text-white"
                                    : "bg-muted text-foreground"
                                }`}
                        >
                            <Hand className="w-5 h-5" />
                        </div>
                    </motion.div>

                    {/* Screen share */}
                    {/* <motion.div
                        onClick={isScreenShared ? () => { } : startScreenSharing}
                        className="flex items-center justify-center cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div
                            className={`p-3 rounded-full ${isScreenShared ? "bg-green-800 animate-pulse" : "bg-muted"
                                }`}
                        >
                            <ScreenShare className={`w-5 h-5 ${isScreenShared? "text-white" : "text-foreground"}`} />
                        </div>
                    </motion.div> */}

                    {/* Message */}
                    {/* <motion.div
                        className="flex items-center justify-center cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div
                            onClick={() => {
                                setIsChatOpen(!isChatOpen);
                            }}
                            className="p-3 rounded-full bg-muted"
                        >
                            <MessageCircle className="w-5 h-5 text-foreground" />
                        </div>
                    </motion.div> */}

                    {/* Peers */}
                    <motion.div
                        onClick={() => {
                            setPeersList(!isPeersListOpen);
                            // setIsChatOpen(false);
                        }}
                        className="flex items-center justify-center cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="p-3 rounded-full bg-muted">
                            <UsersRound className="w-5 h-5 text-foreground" />
                        </div>
                    </motion.div>

                    {/* End meet */}
                    <motion.div
                        onClick={handleLeave}
                        className="flex items-center justify-center cursor-pointer "
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="p-3 rounded-full bg-red-600/80">
                            <Phone className="w-5 h-5 text-white rotate-[135deg]" />
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
