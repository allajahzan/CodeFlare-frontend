import SideBar from "../SideBars/SideBar";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import {
  CalendarCheck2,
  CodeXml,
  CreditCard,
  FileUser,
  IdCard,
  LayoutDashboard,
  ListTodo,
  MessageCircleMore,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Shadow from "../Shadow/Shadow";

function StudentLayout() {
  const isSmall = useSelector((state: stateType) => state.isSmall);

  // sidebar items
  const sideBarItems = [
    { path: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/student/chat", icon: MessageCircleMore, label: "Chats" },
    { path: "/student/tasks", icon: ListTodo, label: "Tasks" },
    { path: "/student/reviews", icon: CalendarCheck2, label: "Reviews" },
    { path: "/student/leetcode", icon: CodeXml, label: "Leetcode" },
    { path: "/student/leaves", icon: IdCard, label: "Leaves" },
    { path: "/student/invoices", icon: CreditCard, label: "Invoices" },
    { path: "/student/manifest", icon: FileUser, label: "Manifest" },
  ];

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
