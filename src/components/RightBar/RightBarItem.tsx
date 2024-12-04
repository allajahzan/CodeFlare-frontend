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
                <TooltipTrigger className="w-full">
                    <div onClick={action} className={`flex items-center justify-center p-2`}>
                        <div className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
                            {children}
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p style={{ fontSize: "13px" }}>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default RightBarItem;
