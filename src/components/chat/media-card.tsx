import { cn } from "@/lib/utils";
import { Message } from "./chat";
import { CheckCheck, ChevronDown, Loader2 } from "lucide-react";
import { useState, useRef } from "react";

// Interface for Props
interface PropsType {
    msg: Message;
    className?: string;
    messagesEndRef: React.MutableRefObject<HTMLDivElement | null>;
}

// Media Card Component
function MediaCard({ msg, className }: PropsType) {
    const [loading, setLoading] = useState<boolean>(true);
    const [imageHeight, setImageHeight] = useState<number | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    // Handle image load
    const handleImageLoad = () => {
        // Scroll to bottom
        // if (messagesEndRef) {
        //     messagesEndRef.current?.scrollIntoView({
        //         behavior: "smooth",
        //         block: "start",
        //     });
        // }

        if (imageRef.current) {
            let h = imageRef.current.clientHeight;
            setImageHeight(h > 250 ? 250 : h); // Get image height
        }

        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    return (
        <div
            className={cn(
                `group self-end relative p-1 shadow-md rounded-lg break-all`,
                imageHeight ? "opacity-100" : "opacity-0",
                className
            )}
        >
            {/* Loader (after image loaded)*/}
            {loading && imageHeight && (
                <div
                    className={`absolute inset-0 flex items-center justify-center bg-background dark:bg-muted rounded-lg`}
                >
                    <Loader2 className="w-5 h-5 text-foreground animate-spin" />
                </div>
            )}

            {/* Image */}
            <div className="relative">
                <img
                    ref={imageRef}
                    className={cn(
                        `w-[200px] md:w-[225px] h-[${imageHeight}px] object-cover rounded-lg transition-opacity duration-300`,
                        loading ? "opacity-0" : "opacity-100"
                    )}
                    src={msg.message}
                    onLoad={handleImageLoad}
                    alt="media"
                />

                {/* Time and Status (after image loaded) */}
                {!loading && (
                    <small className="w-full absolute group-hover:bg-black/20 rounded-b-lg p-1 px-3 right-0 bottom-0 flex items-center justify-end gap-1">
                        <p className="relative z-10  text-[10px] text-white font-semibold">
                            {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                                timeStyle: "short",
                            })}
                        </p>
                        {msg.status === "sent" && (
                            <CheckCheck className="w-4 h-4 text-blue-400 relative z-10" />
                        )}
                    </small>
                )}

                {/* Options (hidden when image loading) */}
                {!loading && (
                    <div className="absolute group-hover:bg-black/20 top-0 right-0 rounded-tr-lg rounded-bl-lg p-1 group-hover:visible invisible flex justify-end cursor-pointer">
                        <ChevronDown className="w-4 h-4 text-white relative z-10" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default MediaCard;
