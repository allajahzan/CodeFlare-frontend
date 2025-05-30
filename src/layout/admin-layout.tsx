import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    resizeAction,
    sideBarVisibilityAction,
    stateType,
} from "@/redux/store";
import {
    // CalendarDaysIcon,
    // CreditCard,
    // Globe,
    // GraduationCap,
    // Home,
    LayersIcon,
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
import Navbar from "@/components/common/navbar/navbar";

// Interface for Props
interface PropsType {
    isDrawerOpen: boolean;
}

// Admin layout Component
function AdminLayout({ isDrawerOpen }: PropsType) {
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
            { path: AppRoutes.DASHBOARD, icon: LayoutDashboard, label: "Dashboard" },
            { path: AppRoutes.ADMIN_USERS, icon: UsersRound, label: "Users" },
            { path: AppRoutes.ADMIN_CURRICULUM + '/' + AppRoutes.ADMIN_BATCHES, icon: LayersIcon, label: "Curriculum" },
            // { path: AppRoutes.ADMIN_BATCHES, icon: Home, label: "Batches" },
            // { path: AppRoutes.ADMIN_WEEKS, icon: CalendarDaysIcon, label: "Weeks" },
            // { path: AppRoutes.ADMIN_DOMAINS, icon: GraduationCap, label: "Domains" },
            { path: AppRoutes.CHATS, icon: MessageCircleMore, label: "Chats" },
            { path: AppRoutes.MEET, icon: Video, label: "Meet" },
            // { path: AppRoutes.ADMIN_INVOICES, icon: CreditCard, label: "Invoices" },
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

export default AdminLayout;
