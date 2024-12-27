import SideBar from "../SideBars/SideBar";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { resizeAction, sideBarStudentAction, stateType } from "@/redux/store";
import {
  CalendarDays,
  CreditCard,
  FileUser,
  Globe,
  LayoutDashboard,
  UsersRound,
} from "lucide-react";
import Shadow from "../ui/shadow";
import { useLayoutEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

function AdminLayout() {
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
        dispatch(sideBarStudentAction(false));
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
      { path: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { path: "/admin/users", icon: UsersRound, label: "Users" },
      ...(isSmall
        ? [{ path: "/community", icon: Globe, label: "Community" }]
        : []),
      { path: "/admin/weeks", icon: CalendarDays, label: "Weeks" },
      { path: "/admin/batches", icon: FileUser, label: "Batches" },
      { path: "/admin/invoices", icon: CreditCard, label: "Invoices" },
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

export default AdminLayout;
