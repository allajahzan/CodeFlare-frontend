import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { LucideProps } from "lucide-react";

interface propTypes {
    Image: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    text: string;
    handleSideBarItems?: (event: React.MouseEvent<HTMLLIElement>) => void;
    color?: string;
}

function SideBarItem({ Image, text, handleSideBarItems }: propTypes) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="w-full">
                    <li
                        data-label={text}
                        onClick={handleSideBarItems}
                        className={`cursor-pointer`}
                    >
                        <div className="flex justify-center p-2">
                            <Image className="text-white w-5 h-5" />
                        </div>
                    </li>
                </TooltipTrigger>
                <TooltipContent>
                    <p style={{ fontSize: "13px" }}>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default SideBarItem;
