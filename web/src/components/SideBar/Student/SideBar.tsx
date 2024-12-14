import SideBarItem from "../Student/SideBarItem";
import { useLocation, useNavigate } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    stateType,
    resizeAction,
    sideBarStudentAction,
} from "../../../redux/store";
import {
    CalendarCheck2,
    CodeXml,
    CreditCard,
    FileUser,
    IdCard,
    LayoutDashboard,
    ListTodo,
    LogOut,
    MessageCircleMore,
} from "lucide-react";
import "../SideBar.css";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

function SideBar() {
    const [style, setStyle] = useState<React.CSSProperties>({});
    const isSmall = useSelector((state: stateType) => state.isSmall);
    const isSideBarStudent = useSelector(
        (state: stateType) => state.isSideBarStudent
    );
    const isShrinkSideBarStudent = useSelector(
        (state: stateType) => state.isShrinkSideBarStudent
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentPath = useLocation().pathname;

    // handle sidebar item
    const handleSideBarItemClick = (event: React.MouseEvent<HTMLLIElement>) => {
        const text = !isSmall
            ? event.currentTarget.getAttribute("data-text")?.toLowerCase()
            : (
                event.currentTarget.querySelector("p") as HTMLParagraphElement
            )?.innerText.toLowerCase();

        if (text) navigate(`/student/${text}`);
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
        const width = isSmall ? "240px" : "130px";
        const transform = isSmall
            ? "translateX(-100%)"
            : isShrinkSideBarStudent
                ? "translateX(-100%)"
                : "translateX(0%)";

        setStyle({
            width,
            transform,
            opacity: 1,
            transition: "all 0.3s ease-in-out",
        });
    }, [isShrinkSideBarStudent, isSmall]);

    // sidebar toggle
    useLayoutEffect(() => {
        const transform = isSideBarStudent
            ? "translateX(0%)"
            : isSmall
                ? "translateX(-100%)"
                : "translateX(0%)";

        setStyle((prev) => ({
            ...prev,
            transform,
        }));
    }, [isSideBarStudent, isSmall]);

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
        <div
            style={style}
            className={`sidebar bg-white ${isSmall ? "shadow-xl z-30" : "z-20"}`}
        >
            {/* SideBar Items Section */}
            <div className={`${isSmall ? 'p-0' : 'p-5'} h-full`}>
                <div
                    style={!isSmall ? { boxShadow: "0.01rem 0.05rem 1rem 0.2rem #d1d5db" } : {}}
                    className={`h-full flex flex-col justify-between py-8  ${isSmall ? 'bg-transparent' : 'bg-zinc-900 rounded-3xl'}`}
                >
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

                    <div className="overflow-auto overflow-x-hidden no-scrollbar h-[448px]">
                        {sideBarItems.map((item) => (
                            <SideBarItem
                                key={item.label}
                                color={currentPath === item.path ? "bg-gray-100" : ""}
                                Image={item.icon}
                                text={item.label}
                                handleSideBarItems={handleSideBarItemClick}
                            />
                        ))}
                    </div>

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
