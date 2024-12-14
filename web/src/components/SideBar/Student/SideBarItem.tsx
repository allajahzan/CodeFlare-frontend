import { useSelector } from "react-redux";
import { stateType } from "../../../redux/store";
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

function SideBarItem({ Image, text, handleSideBarItems, color }: propTypes) {
    const isSmall = useSelector(
        (state: stateType) => state.isSmall
    );

    return (
        <TooltipProvider>
            {!isSmall ? (
                <Tooltip>
                    <TooltipTrigger className="w-full">
                        <li
                            data-text={text}
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
            ) : (
                <li
                    data-text={text}
                    onClick={handleSideBarItems}
                    className={`group cursor-pointer ${color === "" ? "" : color
                        }`}
                >
                    <div className={`flex items-center p-2`}>
                        <div className="flex items-center gap-4">
                            <Image />
                            <p className="pt-0.5 font-bold tracking-wider text-nowrap">
                                {text}
                            </p>
                        </div>
                    </div>
                </li>
            )}
        </TooltipProvider>
    );
}

export default SideBarItem;
