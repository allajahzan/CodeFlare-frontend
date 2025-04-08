import React, { Fragment, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

// Interface for Props
interface PropsType {
    screen: MediaStream | null;
}

// Screen share element Component
function ScreenShareElement({ screen }: PropsType) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (videoRef.current && screen) {
            videoRef.current.srcObject = screen;

            // When video loads, set isLoaded to true
            videoRef.current.onloadeddata = () => setIsLoaded(true);
        }
    }, [screen]);

    return (
        <Fragment>
            {/* Video Element Always Present */}
            <div className="w-full h-full relative bg-zinc-200 dark:bg-sidebar-backgroundDark">
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-foreground animate-spin" />
                    </div>
                )}

                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-contain transition-opacity duration-300
                     ${!isLoaded ? "opacity-0" : "opacity-100"}`}
                />
            </div>
        </Fragment>
    );
}

export default React.memo(ScreenShareElement);
