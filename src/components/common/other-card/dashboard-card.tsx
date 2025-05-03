import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// Interface for Props
interface PropsType {
    header?: ReactNode;
    content: ReactNode;
    className?: string;
}

// Dashboard card Component
function DashboardCard({ header, content, className }: PropsType) {
    return (
        <div
            className={cn(
                "w-full h-[400px] p-5 bg-background dark:bg-sidebar-background border border-border rounded-2xl shadow-sm flex flex-col",
                className
            )}
        >
            {/* Heading */}
            {header}

            {/* Content */}
            <div className="flex-1 overflow-hidden">{content}</div>
        </div>
    );
}

export default DashboardCard;
