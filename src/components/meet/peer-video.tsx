import { Mic, MicOff } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import React from "react";
import { IUser } from "@/types/user";
import VideoElement from "./video-element";

// Interface for Props
interface PropsType {
    socketId: string;
    peer?: IUser;
    media: MediaStream | null;
    isVideoMute: boolean;
    isAudioMute: boolean;
}

// PeerVideo Component
function PeerVideo({
    socketId,
    peer,
    media,
    isVideoMute,
    isAudioMute,
}: PropsType) {
    return (
        <div
            key={socketId}
            className="relative aspect-video flex items-center justify-center w-full h-full
                            bg-zinc-200 dark:bg-sidebar-backgroundDark rounded-2xl overflow-hidden"
        >
            {/* Video Element Always Present */}
            <VideoElement media={media} isVideoMute={isVideoMute} />

            {/* Show Fallback Over Video if Muted */}
            {isVideoMute && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-200 dark:bg-sidebar-backgroundDark">
                    <Avatar className="h-24 w-24">
                        <AvatarFallback className="bg-zinc-300 dark:bg-muted text-foreground text-2xl font-semibold">
                            {peer?.profilePic ? (
                                <img src={peer.profilePic} />
                            ) : (
                                '?'
                            )}
                        </AvatarFallback>
                    </Avatar>
                </div>
            )}

            {/* Mic Status & User Name */}
            <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center">
                <div className="p-1 px-3 flex items-center gap-2 bg-black/30 backdrop-blur-sm text-white rounded-lg text-sm font-medium">
                    <span>{peer?.name || "Peer"}</span>
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
    );
}

export default React.memo(PeerVideo);
