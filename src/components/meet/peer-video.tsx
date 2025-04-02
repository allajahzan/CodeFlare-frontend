import { Loader2, MicOff } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import React, { useState } from "react";
import { IUser } from "@/types/user";

// Interface for Props
interface PropsType {
    socketId: string;
    user?: IUser;
    media: MediaProvider | null;
}

// VideoCard Component
function VideoCard({ socketId, user, media }: PropsType) {
    const [videoLoading, setVideoLoading] = useState<boolean>(true);

    return (
        <div
            key={socketId}
            className="relative aspect-video flex items-center justify-center w-full h-full
                            bg-sidebar dark:bg-sidebar-backgroundDark rounded-2xl overflow-hidden"
        >
            {/* User Video or Avatar */}
            {!media ? (
                // Muted
                <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-sidebar-backgroundDark">
                    <Avatar className="h-24 w-24">
                        <AvatarFallback className="bg-zinc-300 dark:bg-muted font-semibold text-black dark:text-white text-2xl">
                            {"prod"}
                        </AvatarFallback>
                    </Avatar>
                </div>
            ) : (
                // Unmuted
                <div className="relative w-full h-full">
                    {/* Loader */}
                    {videoLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-sidebar dark:bg-sidebar-backgroundDark">
                            <Loader2 className="animate-spin w-12 h-12 text-white" />
                        </div>
                    )}

                    {/* Video */}
                    <video
                        ref={(ref) => {
                            if (ref && media) {
                                ref.srcObject = media;
                            }
                        }}
                        autoPlay
                        playsInline
                        // muted
                        onLoadedMetadata={(e) => {
                            setVideoLoading(false);
                            (e.target as HTMLVideoElement).play();
                        }}
                        className="w-full h-full object-cover transform scale-x-[-1]"
                    />
                </div>
            )}

            <div className="w-full absolute bottom-0 left-0 right-0 p-2 flex justify-between items-center">
                <div className="p-1 px-3 flex items-center gap-2 bg-black/30 backdrop-blur-sm text-white rounded-lg text-sm font-medium">
                    <span>{socketId}</span>
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
    );
}

export default React.memo(VideoCard);

