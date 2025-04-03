import { Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// Interface for Props
interface PropsType {
    media: MediaStream | null;
    isVideoMute: boolean;
}

// VideoElement
function VideoElement({ media, isVideoMute }: PropsType) {
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
                className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300
                     ${!isLoaded || isVideoMute ? "opacity-0" : "opacity-100"}`}
            />
        </div>
    );
}

export default React.memo(VideoElement);
