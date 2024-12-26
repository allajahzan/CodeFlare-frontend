import { useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    stateType,
    sideBarStudentAction,
    themeAction,
} from "../../redux/store";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import SideBarItem from "./SideBarItem";
import { LogOut, LucideProps, Moon, Sun } from "lucide-react";
import "./SideBar.css";
import Slider from "../ui/slider";
import { cn } from "@/lib/utils";
import React from "react";

interface propsType {
    sideBarItems: {
        path: string;
        icon: React.ForwardRefExoticComponent<
            Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
        >;
        label: string;
    }[];
}

function SideBar({ sideBarItems }: propsType) {
    const theme = useSelector((state: stateType) => state.theme);
    const isSmall = useSelector((state: stateType) => state.isSmall);
    const isSideBarVisible = useSelector(
        (state: stateType) => state.isSideBarStudent
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentPath = useLocation().pathname;

    // handle sidebar item
    const handleSideBarItemClick = (event: React.MouseEvent<HTMLLIElement>) => {
        const label = event.currentTarget.getAttribute("data-label")?.toLowerCase();

        if (label) {
            const basePath = currentPath.split("/")[1];
            navigate(`/${basePath}/${label}`);
        }
        if (isSmall) dispatch(sideBarStudentAction(false));
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
                    <div className="overflow-auto overflow-x-hidden no-scrollbar h-[448px]">
                        {sideBarItems.map((item) => (
                            <SideBarItem
                                key={item.label}
                                color={currentPath === item.path ? "" : ""}
                                Image={item.icon}
                                text={item.label}
                                handleSideBarItems={handleSideBarItemClick}
                            />
                        ))}
                    </div>

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
                                    <p style={{ fontSize: "13px" }}>{theme ? "Light" : "Dark"}</p>
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
    );
}

export default React.memo(SideBar);
