import SideBar from "@/components/common/sideBar/sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/common/navbar/navbar";
import { useDispatch, useSelector } from "react-redux";
import { resizeAction, sideBarVisibilityAction, stateType } from "@/redux/store";
import {
    // CreditCard,
    Globe,
    LayoutDashboard,
    MessageCircleMore,
    Settings2,
    UsersRound,
} from "lucide-react";
import Shadow from "@/components/ui/shadow";
import { useLayoutEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import AppRoutes from "@/constants/app-routes";

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
            { path: AppRoutes.CHATS, icon: MessageCircleMore, label: "Chats" },
            ...(isSmall
                ? [{ path: AppRoutes.COMMUNITY, icon: Globe, label: "Community" }]
                : []),
            { path: AppRoutes.ADMIN_GENERAL, icon: Settings2, label: "General" },
            // { path: AppRoutes.ADMIN_INVOICES, icon: CreditCard, label: "Invoices" },
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
            className="h-screen bg-background dark:bg-background"
        >
            <Shadow />
            <SideBar sideBarItems={sideBarItems} />
            <div
                className={cn(
                    "flex flex-col h-full relative transition-all duration-300",
                    isSmall ? "m-0" : "ml-[130px]"
                )}
            >
                <Navbar />
                <div className="h-full overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
