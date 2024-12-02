import {
    dashboard,
    review,
    task,
    invoice,
    leave,
    leetcode,
    user,
    manifest,
    close,
    logout,
    menu,
} from "../../../assets/icons";
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

    const handleShrink = () => {
        const newShrinkState = !isShrinkSideBarStudent;
        dispatch(shrinkSideBarStudentAction(newShrinkState));
        localStorage.setItem("isSideBarStudentShriked", String(newShrinkState));
    };

    const handleSideBarToggle = () => {
        dispatch(sideBarStudentAction(!isSideBarStudent));
    };

    const handleSideBarItemClick = (event: React.MouseEvent<HTMLLIElement>) => {
        const text = !isShrinkSideBarStudent
            ? (
                event.currentTarget.querySelector("p") as HTMLParagraphElement
            )?.innerText.toLowerCase()
            : event.currentTarget.title.toLowerCase();

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
        const width = isShrinkSideBarStudent ? "64px" : "220px";
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
        { path: "/student/dashboard", icon: dashboard, label: "Dashboard" },
        { path: "/student/reviews", icon: review, label: "Reviews" },
        { path: "/student/tasks", icon: task, label: "Tasks" },
        { path: "/student/leetcode", icon: leetcode, label: "Leetcode" },
        { path: "/student/leaves", icon: leave, label: "Leaves" },
        { path: "/student/invoice", icon: invoice, label: "Invoice" },
        { path: "/student/manifest", icon: manifest, label: "Manifest" },
        { path: "", icon: logout, label: "Logout" },
    ];

    return (
        <div
            style={style}
            className={`h-full fixed top-0 left-0 flex flex-col justify-between ${isSmall ? "bg-white shadow-xl z-30" : "bg-white z-20"
                }`}
        >
            {/* Header Section */}
            <div className="p-5 pr-4 flex fixed z-50 bg-white top-0 w-full items-center justify-between">
                {!isShrinkSideBarStudent && (
                    <h1 className="text-xl overflow-hidden font-extrabold">BootCamp</h1>
                )}
                <img
                    onClick={
                        isSideBarStudent && isSmall ? handleSideBarToggle : handleShrink
                    }
                    className="cursor-pointer"
                    src={isSideBarStudent && isSmall ? close : menu}
                    alt="Menu"
                    style={{ width: "28px" }}
                />
            </div>

            {/* SideBar Items Section */}
            <div
                style={{ marginTop: "69px", marginBottom: "80px" }}
                className="overflow-auto overflow-x-hidden relative"
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
                    padding: isShrinkSideBarStudent ? "27.2px 18px" : "18px 18px",
                }}
                className="flex fixed z-50 bottom-0 w-full items-center bg-white overflow-hidden"
            >
                <img src={user} alt="User" style={{ width: "28px" }} />
                {!isShrinkSideBarStudent && (
                    <div className="ml-5 flex flex-col gap-1">
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
