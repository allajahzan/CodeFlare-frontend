import React, { useEffect, useRef } from "react";

// Interface for Props
interface PropsType {
    media: MediaStream | null;
    isVideoMute: boolean;
}

// VideoElement
function VideoElement({ media, isVideoMute }: PropsType) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Set video stream only once (prevents re-render issues)
    useEffect(() => {
        if (videoRef.current && media) {
            videoRef.current.srcObject = media;
        }
    }, [media]);

    return (
        <div className="relative w-full h-full">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${isVideoMute ? "opacity-0" : "opacity-100"
                    }`}
            />
        </div>
    );
}

export default React.memo(VideoElement);
