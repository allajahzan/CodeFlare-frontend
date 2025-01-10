import SideBar from "../sideBars/sideBar";
import { Outlet } from "react-router-dom";
import Navbar from "../navbar/navbar";
import { useDispatch, useSelector } from "react-redux";
import { resizeAction, sideBarStudentAction, stateType } from "@/redux/store";
import {
  CalendarCheck2,
  CodeXml,
  CreditCard,
  FileUser,
  Globe,
  IdCard,
  LayoutDashboard,
  ListTodo,
  MessageCircleMore,
} from "lucide-react";
import Shadow from "../ui/shadow";
import { useLayoutEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

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
      { path: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      ...(isSmall
        ? [{ path: "/community", icon: Globe, label: "Community" }]
        : []),
      { path: "/student/chat", icon: MessageCircleMore, label: "Chats" },
      { path: "/student/tasks", icon: ListTodo, label: "Tasks" },
      { path: "/student/reviews", icon: CalendarCheck2, label: "Reviews" },
      { path: "/student/leetcode", icon: CodeXml, label: "Leetcode" },
      { path: "/student/leaves", icon: IdCard, label: "Leaves" },
      { path: "/student/invoices", icon: CreditCard, label: "Invoices" },
      { path: "/student/manifest", icon: FileUser, label: "Manifest" },
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
