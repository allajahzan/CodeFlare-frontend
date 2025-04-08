import { Avatar, AvatarFallback } from "../ui/avatar";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { IUser } from "@/types/attendence";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Interface for Props
interface PropsType {
    peer?: IUser;
    media: MediaStream | null;
    isVideoMute: boolean;
    className?: string;
}

// Video element Component
function VideoElement({ peer, media, isVideoMute, className }: PropsType) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (videoRef.current && media) {
            videoRef.current.srcObject = media;

            // When video loads, set isLoaded to true
            videoRef.current.onloadeddata = () => setIsLoaded(true);
        }
    }, [media]);

    // When mute/unmute changes, reset loading state
    useEffect(() => {
        if (isVideoMute) {
            setIsLoaded(false);
        } else {
            setTimeout(() => setIsLoaded(true), 500);
        }
    }, [isVideoMute]);

    return (
        <Fragment>
            {/* Video Element Always Present */}
            <div className="w-full h-full relative bg-zinc-200 dark:bg-sidebar-backgroundDark">
                {(!isLoaded || isVideoMute) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-foreground animate-spin" />
                    </div>
                )}

                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className={cn(
                        "w-full h-full object-cover transform scale-x-[1] transition-opacity duration-300",
                        !isLoaded || isVideoMute ? "opacity-0" : "opacity-100",
                        className
                    )}
                />
            </div>

            {/* Show Fallback Over Video if Muted */}
            {isVideoMute && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-200 dark:bg-sidebar-backgroundDark">
                    <Avatar className="h-24 w-24">
                        <AvatarFallback className="bg-zinc-300 dark:bg-muted text-foreground text-2xl font-semibold">
                            {peer?.profilePic ? <img src={peer.profilePic} /> : "?"}
                        </AvatarFallback>
                    </Avatar>
                </div>
            )}
        </Fragment>
    );
}

export default React.memo(VideoElement);
