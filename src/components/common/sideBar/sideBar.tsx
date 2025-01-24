import { useNavigate } from "react-router-dom";
import { useCallback, useContext } from "react";
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
import { userApi } from "@/api/userApi";
import { handleCustomError } from "@/utils/error";
import axiosInstance from "@/utils/axiosInstance";
import { IUserContext, UserContext } from "@/context/userContext";
import { toast } from "@/hooks/use-toast";

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
    // Redux states
    const theme = useSelector((state: stateType) => state.theme);
    const isSmall = useSelector((state: stateType) => state.isSmall);
    const isSideBarVisible = useSelector(
        (state: stateType) => state.isSideBarVisible
    );
    const dispatch = useDispatch();

    // User Context
    const { setIsAuth, setUser } = useContext(UserContext) as IUserContext;

    const navigate = useNavigate();

    // Handle sidebar item
    const handleSideBarItemClick = (path: string) => {
        navigate(path);
        if (isSmall) dispatch(sideBarVisibilityAction(false));
    };

    // Handle theme
    const handleTheme = useCallback(() => {
        dispatch(themeAction(!theme));
    }, [dispatch, theme]);

    // Handle Logout
    const handleLogout = async () => {
        try {
            // Send request
            const resp = await axiosInstance.post(userApi.logout);

            // Success response
            if (resp && resp.status === 200) {
                toast({ title: "Successfully Logged out." });

                // Clear isAuth, user and localStorage
                setIsAuth(false);
                setUser(null);
                localStorage.clear();
            }
        } catch (err: unknown) {
            handleCustomError(err);
        }
    };

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
                    {/* Title */}
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

                        {/*Logout */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger
                                    onClick={() => handleLogout()}
                                    className="w-full"
                                >
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
