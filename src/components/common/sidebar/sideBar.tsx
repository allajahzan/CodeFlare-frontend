import { useNavigate } from "react-router-dom";
import { useCallback, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { stateType, sideBarVisibilityAction } from "@/redux/store";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import SideBarItem from "./sidebar-item";
import { LogOut, LucideProps, Moon, Sun } from "lucide-react";
import "./sidebar.css";
import Slider from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import React from "react";
import { IUserContext, UserContext } from "@/context/user-context";
import { IThemeContext, ThemeContext } from "@/context/theme-context";

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
function Sidebar({ sideBarItems }: PropsType) {
    // Redux states
    const isSmall = useSelector((state: stateType) => state.isSmall);
    const isSideBarVisible = useSelector(
        (state: stateType) => state.isSideBarVisible
    );
    const dispatch = useDispatch();

    // User Context
    const { logout } = useContext(UserContext) as IUserContext;

    // Theme Context
    const { setTheme, theme } = useContext(ThemeContext) as IThemeContext;

    const navigate = useNavigate();

    // Handle sidebar item
    const handleSideBarItemClick = (path: string) => {
        navigate(path);
        if (isSmall) dispatch(sideBarVisibilityAction(false));
    };

    // Handle theme
    const handleTheme = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [theme]);

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
                <div className="h-full py-8 flex flex-col justify-between rounded-3xl bg-sidebar border border-transparent dark:border-customBorder">
                    {isSideBarVisible && <Slider />}
                    {/* Title */}
                    <li>
                        <div className="flex justify-center p-2">
                            <em
                                className="text-sidebar-foreground font-bold tracking-wider"
                                style={{ fontSize: "12px" }}
                            >
                                CodeFlare
                            </em>
                        </div>
                    </li>

                    {/* iTems */}
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
                        {/* Theme */}
                        {isSmall && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger onClick={handleTheme} className="w-full">
                                        <li>
                                            <div className="flex justify-center p-2">
                                                {theme === "light" ? (
                                                    <Sun className="icon" />
                                                ) : (
                                                    <Moon className="icon" />
                                                )}
                                            </div>
                                        </li>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p style={{ fontSize: "13px" }}>
                                            {theme === "light" ? "Light" : "Dark"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        {/*Logout */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger onClick={() => logout()} className="w-full">
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

export default React.memo(Sidebar);
