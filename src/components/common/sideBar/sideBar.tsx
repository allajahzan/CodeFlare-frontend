import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    stateType,
    sideBarVisibilityAction,
    themeAction,
} from "../../../redux/store";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import SideBarItem from "./sideBarItem";
import { LogOut, LucideProps, Moon, Sun } from "lucide-react";
import "./SideBar.css";
import Slider from "../../ui/slider";
import { cn } from "@/lib/utils";
import React from "react";

// Interface for Props
interface PropsType {
    sideBarItems: {
        path: string;
        icon: React.ForwardRefExoticComponent<
            Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
        >;
        label: string;
    }[];
}

// SideBar Component
function SideBar({ sideBarItems }: PropsType) {
    const theme = useSelector((state: stateType) => state.theme);
    const isSmall = useSelector((state: stateType) => state.isSmall);
    const isSideBarVisible = useSelector(
        (state: stateType) => state.isSideBarVisible
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // handle sidebar item
    const handleSideBarItemClick = (path: string) => {
        navigate(path);
        if (isSmall) dispatch(sideBarVisibilityAction(false));
    };

    // handle theme
    const handleTheme = useCallback(() => {
        dispatch(themeAction(!theme));
    }, [dispatch, theme]);

    return (
        <div
            className={cn(
                "sidebar z-50 bg-transparent w-[130px] transition-all duration-300 ease-in-out",
                {
                    "translate-x-0": !isSmall || isSideBarVisible,
                    "-translate-x-full": isSmall && !isSideBarVisible,
                }
            )}
        >
            {/* SideBar Items Section */}
            <div className="h-full p-5">
                <div className="h-full py-8 bg-zinc-900 flex flex-col justify-between rounded-3xl">
                    {isSideBarVisible && <Slider />}
                    {/* title */}
                    <li>
                        <div className="flex justify-center p-2">
                            <em
                                className="text-white font-bold tracking-wider"
                                style={{ fontSize: "12px" }}
                            >
                                CodeFlare
                            </em>
                        </div>
                    </li>

                    {/* items */}
                    <div className="h-[466px] overflow-auto overflow-x-hidden no-scrollbar">
                        {sideBarItems.map((item) => (
                            <SideBarItem
                                key={item.label}
                                path={item.path}
                                Image={item.icon}
                                text={item.label}
                                handleSideBarItems={handleSideBarItemClick}
                            />
                        ))}
                    </div>

                    <div>
                        {/* theme */}
                        {isSmall && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger onClick={handleTheme} className="w-full">
                                        <li>
                                            <div className="flex justify-center p-2">
                                                {theme ? (
                                                    <Sun className="icon" />
                                                ) : (
                                                    <Moon className="icon" />
                                                )}
                                            </div>
                                        </li>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p style={{ fontSize: "13px" }}>
                                            {theme ? "Light" : "Dark"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        {/* logout */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="w-full">
                                    <li>
                                        <div className="flex justify-center p-2">
                                            <LogOut className="icon" />
                                        </div>
                                    </li>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p style={{ fontSize: "13px" }}>Logout</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default React.memo(SideBar);
