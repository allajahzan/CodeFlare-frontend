import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { LucideProps } from "lucide-react";
// import { useLocation } from "react-router-dom";
// import { cn } from "@/lib/utils";

interface propTypes {
    Image: React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
    text: string;
    handleSideBarItems: (path: string) => void;
    path: string;
}

function SideBarItem({ Image, text, handleSideBarItems, path }: propTypes) {
    // const currentPath = useLocation().pathname;
    // const isActive = path && currentPath.split("/")[2] === path.split("/")[2];

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="w-full relative">
                    {/* <div className={cn("absolute left-1 top-[50%] -translate-y-[50%] h-10 w-1 rounded-2xl bg-white transition-all duration-300", isActive? 'opacity-1' : 'opacity-0')}></div> */}
                    <li
                        data-label={text}
                        onClick={()=>{handleSideBarItems(path)}}
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
