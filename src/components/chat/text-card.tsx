import { CheckCheck, ChevronDown } from "lucide-react";
import { Message } from "./chat";
import { cn } from "@/lib/utils";

// Interface for Props
interface PropsType {
    msg: Message;
    className?: string;
}

// Text card Component
function TextCard({ msg, className }: PropsType) {
    return (
        <div
            className={cn(
                "group relative px-4 py-2 pr-20 shadow-md rounded-lg max-w-sm break-all",
                className
            )}
        >
            {/* Text */}
            <p className="text-foreground font-medium">
                {msg.message.split(/(https?:\/\/[^\s]+)/g).map((part, index) =>
                    part.match(/https?:\/\/[^\s]+/) ? (
                        <a
                            key={index}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline break-all"
                        >
                            {part}
                        </a>
                    ) : (
                        part
                    )
                )}
            </p>

            {/* Time */}
            <small className="absolute right-2 bottom-0.5 flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                    timeStyle: "short",
                })}
                {msg.status === "sent" && (
                    // <Check className="w-4 h-4 text-muted-foreground" />
                    <CheckCheck className="w-4 h-4 text-blue-400" />
                )}
                {msg.status === "delivered" && (
                    <CheckCheck className="w-4 h-4 text-muted-foreground" />
                )}
                {msg.status === "seen" && (
                    <CheckCheck className="w-4 h-4 text-blue-400" />
                )}
            </small>

            {/* Options */}
            <div
                className="absolute top-0 right-0 h-full p-2 pt-1 group-hover:visible invisible rounded-r-lg
            bg-transparent"
            >
                <ChevronDown className="w-4 h-4 text-foreground" />
            </div>
        </div>
    );
}

export default TextCard;
