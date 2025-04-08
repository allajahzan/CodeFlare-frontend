import React, { Fragment, useRef } from "react";
import { IUser } from "@/types/attendence";
import VideoElement from "./video-element";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Pin, UserRoundMinus } from "lucide-react";
import ScreenShareElement from "./screenshare-element";
import { motion } from "framer-motion";
import ToolTip from "../common/tooltip/tooltip";

// Interface for Props
interface PropsType {
    socketId: string;
    peer?: IUser;
    media: MediaStream | null;
    screen?: MediaStream | undefined;
    isVideoMute: boolean;
    isAudioMute: boolean;
    setPinnedUser: React.Dispatch<React.SetStateAction<string | null>>;
    className?: string;
    videoElementClassName?: string;
}

// PeerVideo Component
function PeerVideo({
    socketId,
    peer,
    media,
    screen,
    isVideoMute,
    isAudioMute,
    setPinnedUser,
    className,
    videoElementClassName,
}: PropsType) {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            key={socketId}
            className={cn(
                "group relative aspect-video flex items-center justify-center w-full min-h-[230px] h-full",
                "bg-zinc-200 dark:bg-sidebar-backgroundDark border rounded-2xl shadow overflow-hidden",
                className
            )}
        >
            {/* Options */}
            <div className="group-hover:opacity-100 opacity-0 absolute z-50 inset-0 flex items-center justify-center">
                <div className="flex items-center justify-center gap-1 bg-black/40 backdrop-blur-sm text-white rounded-full ">
                    <ToolTip
                        action={() => {
                            setPinnedUser(socketId);
                        }}
                        text="Pin"
                        side="bottom"
                        className="bg-white dark:bg-white dark:text-black border border-border dark:border-zinc-100"
                        children={
                            <div className="p-3 hover:bg-black/30 rounded-full">
                                <Pin className="w-5 h-5" />
                            </div>
                        }
                    />
                    <ToolTip
                        text="Mute"
                        side="bottom"
                        className="bg-white dark:bg-white dark:text-black border border-border dark:border-zinc-100"
                        children={
                            <div className="p-3 hover:bg-black/30 rounded-full">
                                <MicOff className="w-5 h-5" />
                            </div>
                        }
                    />
                    <ToolTip
                        text="Remove"
                        side="bottom"
                        className="bg-white dark:bg-white dark:text-black border border-border dark:border-zinc-100"
                        children={
                            <div className="p-3 hover:bg-black/30 rounded-full">
                                <UserRoundMinus className="w-5 h-5" />
                            </div>
                        }
                    />
                </div>
            </div>

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

                    {/* Mic Status & User Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center">
                        <div className="p-1 px-3 flex items-center gap-2 bg-black/30 backdrop-blur-sm text-white rounded-lg text-sm font-medium">
                            <span>{(peer?.name && "You") || "Peer"}</span>
                        </div>

                        <div className="p-2 bg-black/30 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                            {isAudioMute ? (
                                <MicOff className="h-4 w-4 text-red-600" />
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
                    className="relative flex items-center h-full w-full"
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

                    {/* Mic Status & User Name */}
                    <div className="absolute z-50 bottom-0 left-0 right-0 p-2 flex justify-between items-center">
                        <div className="p-1 px-3 flex items-center gap-2 bg-black/30 backdrop-blur-sm text-white rounded-lg text-sm font-medium">
                            <span>{(peer?.name && "You") || "Peer"}</span>
                        </div>

                        <div className="p-2 bg-black/30 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                            {isAudioMute ? (
                                <MicOff className="h-4 w-4 text-red-600" />
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
