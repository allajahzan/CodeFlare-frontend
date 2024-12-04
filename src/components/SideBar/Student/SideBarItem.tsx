import { useSelector } from "react-redux";
import { stateType } from "../../../redux/store";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
interface propTypes {
    image: JSX.Element;
    text: string;
    handleSideBarItems?: (event: React.MouseEvent<HTMLLIElement>) => void;
    color?: string;
}

function SideBarItem({ image, text, handleSideBarItems, color }: propTypes) {
    const isShrinkSideBarStudent = useSelector(
        (state: stateType) => state.isShrinkSideBarStudent
    );

    return (
        <TooltipProvider>
            {isShrinkSideBarStudent ? (
                <Tooltip>
                    <TooltipTrigger className="w-full">
                        <li
                            data-text={text}
                            onClick={handleSideBarItems}
                            className={`${color === "" ? "" : color
                                } hover:bg-gray-100 cursor-pointer`}
                        >
                            <div className={`flex items-center p-2`}>
                                {image}
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
                    className={`${color === "" ? "" : color
                        } hover:bg-gray-100 cursor-pointer`}
                >
                    <div className={`flex items-center p-2`}>
                        <div className="flex items-center">
                            {image}
                            {!isShrinkSideBarStudent && (
                                <p className="ml-5 font-extrabold tracking-wide text-nowrap">
                                    {text}
                                </p>
                            )}
                        </div>
                    </div>
                </li>
            )}
        </TooltipProvider>
    );
}

export default SideBarItem;
