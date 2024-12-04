import SideBarItem from "../Student/SideBarItem";
import { useLocation, useNavigate } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    stateType,
    resizeAction,
    sideBarStudentAction,
    shrinkSideBarStudentAction,
} from "../../../redux/store";
import "./SideBar.css";
import {
    CalendarCheck2,
    CodeXml,
    CreditCard,
    FileUser,
    IdCard,
    LayoutDashboard,
    ListTodo,
    Menu,
    UserRound,
    X,
} from "lucide-react";

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

    const handleSideBarItemClick = (event: React.MouseEvent<HTMLLIElement>) => {
        const text = !isShrinkSideBarStudent
            ? (
                event.currentTarget.querySelector("p") as HTMLParagraphElement
            )?.innerText.toLowerCase()
            : event.currentTarget.getAttribute("data-text")?.toLowerCase();

        if (text) {
            navigate(`/student/${text}`);
        }

        if (isSmall) {
            dispatch(sideBarStudentAction(false));
        }
    };

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

    useLayoutEffect(() => {
        const width = isShrinkSideBarStudent ? "60px" : "240px";
        const transform = isSmall ? "translateX(-100%)" : "translateX(0%)";

        setStyle({
            width,
            transform,
            opacity: 1,
            transition: "all 0.3s ease-in-out",
        });
    }, [isShrinkSideBarStudent, isSmall]);

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

    const sideBarItems = [
        {
            path: "/student/dashboard",
            icon: <LayoutDashboard />,
            label: "Dashboard",
        },
        { path: "/student/tasks", icon: <ListTodo />, label: "Tasks" },
        { path: "/student/leetcode", icon: <CodeXml />, label: "Leetcode" },
        { path: "/student/reviews", icon: <CalendarCheck2 />, label: "Reviews" },
        { path: "/student/leaves", icon: <IdCard />, label: "Leaves" },
        { path: "/student/invoice", icon: <CreditCard />, label: "Invoice" },
        { path: "/student/manifest", icon: <FileUser />, label: "Manifest" },
    ];

    return (
        <div
            style={style}
            className={`h-full fixed top-0 left-0 flex flex-col justify-between ${isSmall ? "bg-white shadow-xl z-30" : "bg-white z-20"
                }`}
        >
            <li className="fixed top-0 w-full p-5 py-6">
                <div className={`flex items-center`}>
                    {!isShrinkSideBarStudent && (
                        <h1 className="text-xl overflow-hidden font-extrabold w-full">
                            BootCamp
                        </h1>
                    )}
                    <div className="bg-white">
                        {isSmall && isSideBarStudent ? <X /> : <Menu />}
                    </div>
                </div>
            </li>

            {/* SideBar Items Section */}
            <div
                style={{
                    marginTop: "73px",
                    marginBottom: "82px",
                    scrollbarWidth: "none",
                }}
                className="overflow-auto overflow-x-hidden relative no-scrollbar"
            >
                {sideBarItems.map((item) => (
                    <SideBarItem
                        key={item.label}
                        color={currentPath === item.path ? "bg-gray-100" : ""}
                        image={item.icon}
                        text={item.label}
                        handleSideBarItems={handleSideBarItemClick}
                    />
                ))}
            </div>

            {/* Footer Section */}
            <div
                title={isShrinkSideBarStudent ? `Ahsan allaj pk MERNStack` : ""}
                style={{
                    padding: isShrinkSideBarStudent ? "29px 18px" : "18px 18px",
                }}
                className="flex fixed z-50 bottom-0 w-full items-center bg-gray-100 overflow-hidden"
            >
                <div>
                    <UserRound />
                </div>
                {!isShrinkSideBarStudent && (
                    <div className="ml-5 flex flex-col gap-1 text-nowrap">
                        <p className="font-extrabold">Ahsan allaj pk</p>
                        <p className="font-extrabold" style={{ fontSize: "13.2px" }}>
                            MERN Stack
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SideBar;
