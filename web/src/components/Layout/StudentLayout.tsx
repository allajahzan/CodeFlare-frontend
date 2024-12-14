import { stateType } from "@/redux/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import Shadow from "../Shadow/Shadow";
import SideBar from "../SideBar/Student/SideBar";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import './Layout.css'

function StudentLayout() {
    const isSmall = useSelector((state: stateType) => state.isSmall);

    const style = useMemo<React.CSSProperties>(
        () => ({
            paddingTop: "0px",
            paddingLeft: isSmall ? "20px" : "130px",
            transition: "all 0.3s ease-in-out",
        }),
        [isSmall]
    );

    const containerStyles = useMemo<React.CSSProperties>(
        () => ({
            backgroundColor: "white",
            padding: "30px 30px 30px 0px",
        }),
        []
    );

    return (
        <div className="bg-white">
            <Shadow />
            <div className="flex h-full">
                <SideBar />
                <div style={style} className="w-full">
                    <div style={containerStyles} className="container_style">
                        <Navbar />
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentLayout;
