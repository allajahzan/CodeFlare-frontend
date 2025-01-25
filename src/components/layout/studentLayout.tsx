import SideBar from "@/components/common/sideBar/sideBar";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/common/navbar/navbar";
import { useDispatch, useSelector } from "react-redux";
import { resizeAction, sideBarVisibilityAction, stateType } from "@/redux/store";
import {
  CalendarCheck2,
  CreditCard,
  FileUser,
  Globe,
  IdCard,
  LayoutDashboard,
  ListTodo,
  MessageCircleMore,
} from "lucide-react";
import Shadow from "@/components/ui/shadow";
import { useLayoutEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import AppRoutes from "@/constants/appRoutes";

function StudentLayout() {
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
      ...(isSmall
        ? [{ path: "/community", icon: Globe, label: "Community" }]
        : []),
      { path: AppRoutes.CHATS, icon: MessageCircleMore, label: "Chats" },
      { path: AppRoutes.STUDENT_TASKS, icon: ListTodo, label: "Tasks" },
      { path: AppRoutes.STUDENT_REVIEWS, icon: CalendarCheck2, label: "Reviews" },
      { path: AppRoutes.STUDENT_LEAVES, icon: IdCard, label: "Leaves" },
      { path: AppRoutes.STUDENT_INVOICES, icon: CreditCard, label: "Invoices" },
      { path: AppRoutes.PROFILE, icon: FileUser, label: "Manifest" },
    ],
    [isSmall]
  );

  return (
    <div className="h-screen bg-white">
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

export default StudentLayout;
