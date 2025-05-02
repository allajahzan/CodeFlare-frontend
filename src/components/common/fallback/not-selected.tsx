import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideProps } from "lucide-react";

// Interface for Props
interface PropsType {
    Icon?: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    IconClassName?: string;
    text?: string;
    message?: string;
    className?: string;
}

// NotSelected Component
function NotSelected({
    Icon,
    IconClassName,
    text,
    message,
    className,
}: PropsType) {
    return (
        <div
            className={cn(
                "flex flex-col gap-5 items-center justify-center rounded-2xl bg-background dark:bg-sidebar-background border border-border shadow-sm",
                className
            )}
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-3 bg-transparent border-2 border-dashed rounded-full"
            >
                {Icon && (
                    <Icon
                        className={cn("w-5 h-5 text-muted-foreground", IconClassName)}
                    />
                )}
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center space-y-1"
            >
                <h3 className="text-foreground text-base font-semibold">{text}</h3>
                <p className="text-muted-foreground font-medium text-sm">{message}</p>
            </motion.div>
        </div>
    );
}

export default NotSelected;
