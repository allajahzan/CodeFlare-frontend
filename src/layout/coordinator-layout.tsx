import { Outlet } from "react-router-dom";
import Navbar from "@/components/common/navbar/navbar";
import { useDispatch, useSelector } from "react-redux";
import {
    resizeAction,
    sideBarVisibilityAction,
    stateType,
} from "@/redux/store";
import {
    CalendarClockIcon,
    // Globe,
    //   CalendarDays,
    //   CreditCard,
    //   FileUser,
    //   Globe,
    LayoutDashboard,
    MessageCircleMore,
    UsersRound,
    Video,
} from "lucide-react";
import Shadow from "@/components/ui/shadow";
import { useLayoutEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import AppRoutes from "@/constants/app-routes";
import Sidebar from "../components/common/sidebar/sideBar";

// Interface for Props
interface PropsType {
    isDrawerOpen: boolean;
}

// Coordinator layout Component
function CoordinatorLayout({ isDrawerOpen }: PropsType) {
    const isSmall = useSelector((state: stateType) => state.isSmall);
    const dispatch = useDispatch();

    // screen size
    useLayoutEffect(() => {
        const updateScreenSize = () => {
            if (window.innerWidth < 899) {
                dispatch(resizeAction(true));
                localStorage.setItem("isSizeSmall", "1");
            } else {
                dispatch(resizeAction(false));
                dispatch(sideBarVisibilityAction(false));
                localStorage.setItem("isSizeSmall", "0");
            }
        };

        updateScreenSize();
        window.addEventListener("resize", updateScreenSize);
        return () => window.removeEventListener("resize", updateScreenSize);
    }, [isSmall]);

    // sidebar items
    const sideBarItems = useMemo(
        () => [
            {
                path: AppRoutes.DASHBOARD,
                icon: LayoutDashboard,
                label: AppRoutes.DASHBOARD,
            },
            {
                path: AppRoutes.COORDINATOR_STUDENTS,
                icon: UsersRound,
                label: "Students",
            },
            {
                path: AppRoutes.ATTENDENCE,
                icon: CalendarClockIcon,
                label: "Attendance",
            },
            { path: AppRoutes.CHATS, icon: MessageCircleMore, label: "Chats" },
            { path: AppRoutes.MEET, icon: Video, label: "Meet" },
            // ...(isSmall
            //     ? [{ path: AppRoutes.COMMUNITY, icon: Globe, label: "Community" }]
            //     : []),
        ],
        [isSmall]
    );

    return (
        <div
            style={{
                ...(isDrawerOpen
                    ? {
                        transformOrigin: "center top",
                        transitionProperty: "transform, border-radius",
                        transitionDuration: "0.3s",
                        transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
                        borderRadius: "8px",
                        overflow: "hidden",
                        transform:
                            "scale(0.9447983014861996) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)",
                    }
                    : {
                        transformOrigin: "center top",
                        transitionProperty: "transform",
                        transitionDuration: "0.3s",
                        transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
                        borderRadius: "0px",
                        overflow: "hidden",
                        transform: "scale(1) translate3d(0, 0, 0)",
                    }),
            }}
            className="h-screen"
        >
            <Shadow />
            <Sidebar sideBarItems={sideBarItems} />
            <div
                className={cn(
                    "flex flex-col h-full relative transition-all duration-300",
                    isSmall ? "m-0" : "ml-[130px]"
                )}
            >
                <Navbar />
                <div className="h-full overflow-auto no-scrollbar will-change-transform">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default CoordinatorLayout;
