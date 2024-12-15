import SideBar from "../SideBar/Student/SideBar";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Layout.css";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import { cn } from "@/lib/utils";

function StudentLayout() {

    const isSmall  = useSelector((state:stateType)=>state.isSmall)

    return (
        <div className="bg-white">
            <div className="flex h-screen">
                <SideBar />
                <div className={cn("flex flex-grow flex-col h-full relative", isSmall? 'm-0' : 'ml-[130px]')}>
                    <Navbar />
                    <div className="h-screen overflow-auto">                        
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentLayout;
