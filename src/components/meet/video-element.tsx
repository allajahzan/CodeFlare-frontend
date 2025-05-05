import { Avatar, AvatarFallback } from "../ui/avatar";
import React, {
    Fragment,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { IUserContext, UserContext } from "@/context/user-context";
import { IUserBasic } from "@codeflare/common";

// Interface for Props
interface PropsType {
    peer?: IUserBasic;
    media: MediaStream | null;
    isVideoMute: boolean;
    className?: string;
}

// Video element Component
function VideoElement({ peer, media, isVideoMute, className }: PropsType) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const { user } = useContext(UserContext) as IUserContext;

    useEffect(() => {
        if (videoRef.current && media) {
            videoRef.current.srcObject = media;
            videoRef.current.muted = peer?._id === user?._id;
        }
    }, [media, peer, user]);

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
            <div className="w-full h-full relative bg-transparent">
                {(!isLoaded || isVideoMute) && (
                    <div className="absolute bg-muted dark:bg-sidebar-backgroundDark inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-foreground animate-spin" />
                    </div>
                )}

                <video
                    key={peer?._id}
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className={cn(
                        "w-full h-full object-cover transform scale-x-[1] transition-all duration-500",
                        !isLoaded || isVideoMute ? "hidden" : "visible",
                        className
                    )}
                />
            </div>

            {/* Show Fallback Over Video if Muted */}
            {isVideoMute && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted dark:bg-sidebar-backgroundDark">
                    <Avatar className="h-24 w-24">
                        <AvatarFallback className="bg-zinc-200 dark:bg-muted text-foreground text-2xl font-semibold">
                            {peer?.profilePic ? <img src={peer.profilePic} /> : peer?.name[0]}
                        </AvatarFallback>
                    </Avatar>
                </div>
            )}
        </Fragment>
    );
}

export default React.memo(VideoElement);
