import { ReactNode } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface propType {
    children: ReactNode;
    action?: () => void;
    text: string;
}

function RightBarItem({ children, action, text }: propType) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <div
                        onClick={action}
                        className="flex items-center justify-center cursor-pointer"
                    >
                        <div className="hover:bg-gray-100 p-3 rounded-xl">{children}</div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p style={{ fontSize: "12px"}}>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default RightBarItem;
