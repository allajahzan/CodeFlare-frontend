import React, { useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import SideBarItem from "../Counsellor/SideBarItem";
import {
    stateType,
    resizeAction,
    shrinkSideBarCounsellorAction,
    sideBarCounsellorAction,
    showStudentDropDownAction,
} from "../../../redux/store";
import "./SideBar.css";

// Import icons
import {
    dashboard,
    hub,
    studentsMore,
    students,
    critical,
    held,
    quality,
    leave,
    review,
    fumigation,
    manifest,
    logout,
    invoice,
    user,
    menu,
    close,
} from "../../../assets/icons";

function SideBar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [style, setStyle] = useState<React.CSSProperties>({});
    const [studentDropDownStyle, setStudentDropDownStyle] =
        useState<React.CSSProperties>({});
    const [belowItemsStyle, setBelowItemsStyle] = useState<React.CSSProperties>(
        {}
    );

    const {
        isSmall,
        isSideBarCounsellor,
        isShrinkSideBarCounsellor,
        isStudentDropDownShow,
    } = useSelector((state: stateType) => ({
        isSmall: state.isSmall,
        isSideBarCounsellor: state.isSideBarCounsellor,
        isShrinkSideBarCounsellor: state.isShrinkSideBarCounsellor,
        isStudentDropDownShow: state.isStudentDropDownShow,
    }));

    const currentPath = location.pathname;

    // Handlers
    const toggleSidebarShrink = () => {
        const newShrinkState = !isShrinkSideBarCounsellor;
        dispatch(shrinkSideBarCounsellorAction(newShrinkState));
        localStorage.setItem("isSideBarCounsellorShriked", `${newShrinkState}`);
    };

    const toggleSidebar = () => {
        toggleSidebarShrink();
        dispatch(sideBarCounsellorAction(!isSideBarCounsellor));
    };

    const toggleStudentDropDown = () => {
        const newState = !isStudentDropDownShow;
        dispatch(showStudentDropDownAction(newState));
        localStorage.setItem("isStudentDropDownShow", `${newState}`);
    };

    const handleSideBarItemClick = (path: string) => {
        navigate(`/counsellor/${path}`);
        if (isSmall) {
            dispatch(sideBarCounsellorAction(false));
        }
    };

    // Effects
    useLayoutEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 899) {
                dispatch(resizeAction(true));
            } else {
                dispatch(resizeAction(false));
                dispatch(sideBarCounsellorAction(false));
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [dispatch]);

    useLayoutEffect(() => {
        setStudentDropDownStyle({
            opacity: isStudentDropDownShow ? 1 : 0,
            transition: "all 0.3s ease-in-out",
            transform: isStudentDropDownShow ? "translateY(0%)" : "translateY(-100%)",
        });
        setBelowItemsStyle({
            transition: "all 0.3s ease-in-out",
            marginTop: isStudentDropDownShow ? "0px" : "-320px",
        });
    }, [isStudentDropDownShow]);

    useLayoutEffect(() => {
        setStyle({
            width: isShrinkSideBarCounsellor ? "80px" : "250px",
            transform: isSmall ? "translateX(-100%)" : "translateX(0%)",
            opacity: 1,
            transition: "all 0.3s ease-in-out",
        });
    }, [isSmall, isShrinkSideBarCounsellor]);

    useLayoutEffect(() => {
        setStyle((prev) => ({
            ...prev,
            transform: isSideBarCounsellor
                ? "translateX(0%)"
                : isSmall
                    ? "translateX(-100%)"
                    : "translateX(0%)",
        }));
    }, [isSideBarCounsellor]);

    // SideBar items
    const sideBarItems = [
        { image: dashboard, text: "Dashboard", path: "dashboard" },
        { image: hub, text: "Hub details", path: "leaves" },
    ];

    const studentItems = [
        { image: students, text: "Ongoing Students", path: "ongoingstudents" },
        { image: held, text: "Held Students", path: "heldstudents" },
        { image: critical, text: "Critical Students", path: "criticalstudents" },
        { image: quality, text: "Quality Students", path: "qualitystudents" },
        { image: leave, text: "Placement Cell", path: "placementcell" },
    ];

    const belowItems = [
        { image: manifest, text: "Manifest", path: "manifest" },
        { image: leave, text: "Leave Reports", path: "leavereports" },
        { image: review, text: "Reviews", path: "reviews" },
        { image: invoice, text: "Transfers", path: "transfers" },
        { image: fumigation, text: "Fumigation", path: "fumigation" },
        { image: logout, text: "Logout", path: "" },
    ];

    return (
        <div
            style={style}
            className={`h-full fixed top-0 left-0 flex flex-col justify-between ${isSmall ? "bg-white shadow-xl z-30" : "bg-white z-20"
                }`}
        >
            {/* Header */}
            <div className="p-5 pr-4 flex fixed z-50 bg-white top-0 w-full items-center justify-between">
                {!isShrinkSideBarCounsellor && (
                    <h1 className="text-xl font-extrabold">BootCamp</h1>
                )}
                <img
                    onClick={
                        isSideBarCounsellor && isSmall ? toggleSidebar : toggleSidebarShrink
                    }
                    style={{ width: "28px" }}
                    className="cursor-pointer"
                    src={isSideBarCounsellor && isSmall ? close : menu}
                    alt=""
                />
            </div>

            {/* Sidebar Items */}
            <div
                style={{ marginTop: "68px" }}
                className="overflow-auto overflow-x-hidden"
            >
                <div className="flex flex-col border-b-2 relative z-10 bg-white">
                    {sideBarItems.map((item) => (
                        <SideBarItem
                            key={item.text}
                            color={
                                currentPath === `/counsellor/${item.path}` ? "bg-gray-100" : ""
                            }
                            image={item.image}
                            text={item.text}
                            handleSideBarItems={() => handleSideBarItemClick(item.path)}
                        />
                    ))}
                </div>

                {/* Student Dropdown */}
                <div className="relative z-10 bg-white">
                    <SideBarItem
                        showStudentDropDown={isStudentDropDownShow}
                        image={studentsMore}
                        text="Students"
                        handleSideBarItems={toggleStudentDropDown}
                    />
                </div>
                <div style={studentDropDownStyle} className="flex flex-col border-b-2">
                    {studentItems.map((item) => (
                        <SideBarItem
                            key={item.text}
                            color={
                                currentPath === `/counsellor/${item.path}` ? "bg-gray-100" : ""
                            }
                            image={item.image}
                            text={item.text}
                            handleSideBarItems={() => handleSideBarItemClick(item.path)}
                        />
                    ))}
                </div>

                {/* Below Items */}
                <div style={belowItemsStyle} className="flex flex-col">
                    {belowItems.map((item) => (
                        <SideBarItem
                            key={item.text}
                            color={
                                currentPath === `/counsellor/${item.path}` ? "bg-gray-100" : ""
                            }
                            image={item.image}
                            text={item.text}
                            handleSideBarItems={() => handleSideBarItemClick(item.path)}
                        />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div
                title={isShrinkSideBarCounsellor ? `Vidhul Counsellor` : ""}
                style={{ padding: isShrinkSideBarCounsellor ? "27.2px 18px" : "18px" }}
                className="flex  w-full items-center bg-white"
            >
                <img style={{ width: "28px" }} src={user} alt="" />
                {!isShrinkSideBarCounsellor && (
                    <div className="ml-5 flex flex-col gap-1">
                        <p className="font-extrabold">Vidhul</p>
                        <p style={{ fontSize: "13.2px" }} className="font-extrabold">
                            Counsellor
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SideBar;
