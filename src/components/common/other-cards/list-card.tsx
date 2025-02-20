import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";

// Interface for Props
interface PropsType {
    index: number;
    text: string;
    children: ReactNode;
}

// List card Component
function ListCard({ index, text, children }: PropsType) {
    return (
        <motion.div
            key={1}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={cn(
                "group p-2 px-3 w-full flex flex-col rounded-xl cursor-pointer border border-border hover:bg-muted dark:hover:bg-sidebar"
            )}
        >
            <div className="flex items-center">
                {/* Name and other details */}
                <div className="w-full flex items-center justify-between gap-2">
                    <p className="font-semibold text-foreground truncate">{text}</p>
                    {children}
                </div>
            </div>
        </motion.div>
    );
}

export default ListCard;
