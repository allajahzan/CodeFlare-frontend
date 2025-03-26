import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";

// Interface for Props
interface PropsType {
    children: ReactNode;
    action?: () => void;
    text: string;
    side?: "top" | "bottom" | "left" | "right";
}

function ToolTip({ children, text, action, side }: PropsType) {
    return (
        <TooltipProvider disableHoverableContent={true}>
            <Tooltip>
                <TooltipTrigger className="">
                    <div onClick={action} className="">
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent 
                    className="text-foreground dark:bg-sidebar border borer-2"
                    side={side}
                >
                    <p style={{ fontSize: "13px" }}>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default ToolTip;
