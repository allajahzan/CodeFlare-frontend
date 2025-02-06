import { Check, CheckCheck, ChevronDown } from "lucide-react";
import { Message } from "./chat";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Interface for Props
interface PropsType {
    msg: Message;
    className?: string;
    index: number;
}

// Text card Component
function TextCard({ msg, className, index }: PropsType) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.01 }}
            className={cn(
                "group relative px-4 py-2 pr-20 shadow-md rounded-lg max-w-sm break-all",
                className
            )}
        >
            {/* Text */}
            <p className="text-foreground font-medium">{msg.message}</p>

            {/* Time */}
            <small className="absolute right-2 bottom-0.5 flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                {msg.createdAt}
                {msg.status === "sent" && (
                    <Check className="w-4 h-4 text-muted-foreground" />
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
        </motion.div>
    );
}

export default TextCard;
