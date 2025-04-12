import React, { Fragment, useContext, useRef } from "react";
import { IUser } from "@/types/attendence";
import VideoElement from "./video-element";
import { cn } from "@/lib/utils";
import { Crown, Hand, Mic, MicOff, Pin, PinOff } from "lucide-react";
import ScreenShareElement from "./screenshare-element";
import { motion } from "framer-motion";
import ToolTip from "../common/tooltip/tooltip";
import { socket } from "@/socket/communication/connect";
import { IUserContext, UserContext } from "@/context/user-context";
import { IMeet } from "./meeting-join";

// Interface for Props
interface PropsType {
    socketId: string;
    peer?: IUser;
    media: MediaStream | null;
    screen?: MediaStream | undefined;
    isVideoMute: boolean;
    isAudioMute: boolean;
    isHandRaised: boolean;
    pinnedUser?: string;
    setPinnedUser: React.Dispatch<React.SetStateAction<string | undefined>>;
    isOptionsShow: boolean;
    className?: string;
    videoElementClassName?: string;
    meet: IMeet;
}

// PeerVideo Component
function PeerVideo({
    socketId,
    peer,
    media,
    screen,
    isVideoMute,
    isAudioMute,
    isHandRaised,
    pinnedUser,
    setPinnedUser,
    isOptionsShow,
    className,
    videoElementClassName,
    meet,
}: PropsType) {
    const containerRef = useRef<HTMLDivElement>(null);

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    return (
        <div
            key={socketId}
            className={cn(
                "group relative aspect-video flex items-center justify-center min-h-[100px] md:min-h-[160px]",
                "bg-muted dark:bg-sidebar-backgroundDark rounded-2xl overflow-hidden shadow-md",
                "border-2 border-white dark:border-zinc-700",
                className
            )}
        >
            {/* Options */}
            {isOptionsShow && (
                <div className="group-hover:opacity-100 opacity-0 absolute z-40 inset-0 flex items-center justify-center">
                    <div className="flex items-center justify-center gap-1 bg-black/40 backdrop-blur-sm text-white rounded-full ">
                        <ToolTip
                            action={() =>
                                setPinnedUser((prev) => {
                                    if (prev === socketId) {
                                        return socket.id as string;
                                    } else {
                                        return socketId;
                                    }
                                })
                            }
                            text="Pin"
                            side="bottom"
                            className="bg-background dark:bg-muted text-foreground border-none dark:border-none"
                            children={
                                <div className="p-3 hover:bg-black/30 rounded-full">
                                    {pinnedUser === socketId ? (
                                        <PinOff className="w-4 h-4" />
                                    ) : (
                                        <Pin className="w-4 h-4" />
                                    )}
                                </div>
                            }
                        />
                    </div>
                </div>
            )}

            {/* If screen is not shared */}
            {!screen && (
                <Fragment>
                    {/* Large video element */}
                    <VideoElement
                        isVideoMute={isVideoMute}
                        media={media}
                        peer={peer}
                        className={videoElementClassName}
                    />

                    {/* User Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center">
                        <div className="shadow p-1 px-3 flex items-center gap-2 bg-black/30 backdrop-blur-sm text-white rounded-lg text-sm font-medium">
                            <span>{peer?._id === user?._id ? "You" : peer?.name}</span>
                            {meet.host._id === peer?._id && (
                                <Crown className="w-4 h-4 text-yellow-400" />
                            )}
                        </div>
                    </div>

                    {/* Mic status */}
                    <div className="absolute z-50 top-0 right-0 p-2 flex justify-between items-center gap-2">
                        {isHandRaised && (
                            <div className="shadow p-2 animate-pulse bg-white backdrop-blur-sm text-black rounded-full text-sm font-medium">
                                <Hand className="h-4 w-4 text-black" />
                            </div>
                        )}
                        <div className="shadow p-2 bg-black/30 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                            {isAudioMute ? (
                                <MicOff className="h-4 w-4 text-white" />
                            ) : (
                                <Mic className="h-4 w-4 text-white" />
                            )}
                        </div>
                    </div>
                </Fragment>
            )}

            {/* If screen is shared  */}
            {screen && (
                <div
                    ref={containerRef}
                    className="relative flex items-center h-full w-full shadow-md"
                >
                    {/* Small video element */}
                    <motion.div
                        drag
                        dragConstraints={containerRef}
                        className="absolute z-50 top-2 right-2 w-[180px] h-[120px] rounded-lg overflow-hidden border shadow dark:shadow-md cursor-move"
                    >
                        <VideoElement
                            isVideoMute={isVideoMute}
                            media={media}
                            peer={peer}
                            className={videoElementClassName}
                        />
                    </motion.div>

                    {/* Screen element */}
                    <div className=" w-full">
                        <ScreenShareElement screen={screen} />
                    </div>

                    {/* User Name */}
                    <div className="absolute z-50 bottom-0 left-0 right-0 p-2 flex justify-between items-center">
                        <div className="p-1 px-3 flex items-center gap-2 bg-black/30 backdrop-blur-sm text-white rounded-lg text-sm font-medium">
                            <span>{(peer?.name && "You") || "Peer"}</span>
                        </div>
                    </div>

                    {/* Mic status */}
                    <div className="absolute z-50 top-0 right-0 p-2 flex justify-between items-center">
                        <div className="p-2 bg-black/30 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                            {isAudioMute ? (
                                <MicOff className="h-4 w-4 text-white" />
                            ) : (
                                <Mic className="h-4 w-4 text-white" />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default React.memo(PeerVideo);
