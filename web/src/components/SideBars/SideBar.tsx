import { useLocation, useNavigate } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    stateType,
    resizeAction,
    sideBarStudentAction,
} from "../../redux/store";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import SideBarItem from "./SideBarItem";
import { LogOut, LucideProps } from "lucide-react";
import "./SideBar.css";
import Slider from "../Slider/Slider";

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
    const [style, setStyle] = useState<React.CSSProperties>({});
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
            const basePath = window.location.pathname.split("/")[1];
            navigate(`${basePath}/${label}`);
        }
        if (isSmall) dispatch(sideBarStudentAction(false));
    };

    // screen size
    useLayoutEffect(() => {
        const updateScreenSize = () => {
            if (window.innerWidth < 899) {
                dispatch(resizeAction(true));
            } else {
                dispatch(resizeAction(false));
                dispatch(sideBarStudentAction(false));
            }
        };

        updateScreenSize();
        window.addEventListener("resize", updateScreenSize);
        return () => window.removeEventListener("resize", updateScreenSize);
    }, [dispatch]);

    // sidebar shrink
    useLayoutEffect(() => {
        const width = "130px";
        const transform = isSmall ? "translateX(-100%)" : "translateX(0%)";

        setStyle({
            width,
            transform,
            opacity: 1,
            transition: "all 0.3s ease-in-out",
        });
    }, [isSmall]);

    // sidebar toggle
    useLayoutEffect(() => {
        const transform = isSmall
            ? isSideBarVisible
                ? "translateX(0%)"
                : "translateX(-100%)"
            : "translateX(0%)";

        setStyle((prev) => ({
            ...prev,
            transform,
        }));
    }, [isSideBarVisible, isSmall]);

    return (
        <div style={style} className="sidebar z-50 bg-transparent">
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

                    {/* logout */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="w-full">
                                <li>
                                    <div className="flex justify-center p-2">
                                        <LogOut className="text-white w-5 h-5" />
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

export default SideBar;
