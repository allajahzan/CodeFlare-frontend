import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// Interface for Props
interface PropsType {
    children: ReactNode;
    action?: () => void;
    text: string;
    side?: "top" | "bottom" | "left" | "right";
    className?: string;
    MainClassName?: string;
}

function ToolTip({ children, text, action, side, className, MainClassName }: PropsType) {
    return (
        <TooltipProvider disableHoverableContent={true}>
            <Tooltip>
                <TooltipTrigger className={cn(MainClassName)}>
                    <div onClick={action} className="">
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent
                    className={cn(
                        "text-foreground dark:bg-sidebar border borer-2",
                        className
                    )}
                    side={side}
                >
                    <p style={{ fontSize: "13px" }}>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default ToolTip;
