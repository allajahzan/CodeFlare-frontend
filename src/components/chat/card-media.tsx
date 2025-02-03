import { cn } from "@/lib/utils";
import { Message } from "./chat";
import { CheckCheck, ChevronDown } from "lucide-react";

// Interface for Props
interface PropsType {
    msg: Message;
    className?: string;
}

// Media card Component
function MediaCard({ msg, className }: PropsType) {
    return (
        <div
            className={cn(
                "group self-end relative p-1 shadow-md rounded-lg break-all",
                className
            )}
        >
            {/* Text */}
            <img
                className="w-full h-full max-w-[250px] max-h-[400px] object-cover rounded-lg"
                src={msg.text}
                alt=""
            />

            {/* Time */}
            <small className="w-full absolute p-2 px-3 right-0 bottom-0 flex items-center justify-end gap-1 text-[10px] text-white font-semibold">
                {msg.time}
                <CheckCheck className="w-4 h-4 text-blue-400" />
            </small>

            {/* Options */}
            <div className="absolute top-0 right-0 p-3 group-hover:visible invisible">
                <ChevronDown className="w-5 h-5 text-white" />
            </div>
        </div>
    );
}

export default MediaCard;
