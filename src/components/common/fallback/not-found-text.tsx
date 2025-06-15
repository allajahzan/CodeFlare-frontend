import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideProps } from "lucide-react";

// Interface for Props
interface PropsType {
    MainIcon?: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    IconClassName?: string;
    text?: string;
    className?: string;
    delay?: number;
}

// NotFoundYet Component
function NotFoundYet({ MainIcon, IconClassName, text, className, delay }: PropsType) {
    return (
        <div
            className={cn(
                "flex flex-col items-center gap-2 text-muted-foreground font-medium",
                className
            )}
        >
            <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0 }}
                className=""
            >
                {MainIcon && <MainIcon className={cn("w-5 h-5", IconClassName)} />}
            </motion.span>
            <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay || 0 }}
                className="text-center text-sm"
            >
                {text}
            </motion.p>
        </div>
    );
}

export default NotFoundYet;