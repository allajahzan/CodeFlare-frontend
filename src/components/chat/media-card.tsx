import { cn } from "@/lib/utils";
import { Message } from "./chat";
import { CheckCheck, ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";

// Interface for Props
interface PropsType {
    msg: Message;
    className?: string;
}

// Media Card Component
function MediaCard({ msg, className }: PropsType) {
    const [loading, setLoading] = useState<boolean>(true);

    return (
        <div
            className={cn(
                "group self-end relative p-1 shadow-md rounded-lg break-all",
                className
            )}
        >
            {/* Loader while image loads */}
            {loading && (
                <div className="w-[225px] h-[300px] flex items-center justify-center bg-background dark:bg-muted rounded-lg">
                    <Loader2 className="w-5 h-5 text-foreground animate-spin" />
                </div>
            )}

            {/* Image (hidden while loading) */}
            <img
                className={cn(
                    "w-[225px] h-[300px] object-cover rounded-lg transition-opacity duration-300",
                    loading ? "hidden" : "block"
                )}
                src={msg.message}
                alt="media"
                onLoad={() => setLoading(false)}
            />

            {/* Time and Status (shown only after image loads) */}
            {!loading && (
                <small className="w-full absolute p-2 px-3 right-0 bottom-0 flex items-center justify-end gap-1 text-[10px] text-white font-semibold">
                    {msg.createdAt}
                    {msg.status === "sent" && (
                        <CheckCheck className="w-4 h-4 text-blue-400" />
                    )}
                </small>
            )}

            {/* Options (hidden while loading) */}
            {!loading && (
                <div className="absolute top-0 right-0 p-3 group-hover:visible invisible">
                    <ChevronDown className="w-5 h-5 text-white" />
                </div>
            )}
        </div>
    );
}

export default MediaCard;
