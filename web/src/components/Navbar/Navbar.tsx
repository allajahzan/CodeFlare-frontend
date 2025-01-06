import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    sideBarStudentAction,
    stateType,
    themeAction,
} from "../../redux/store";
import NavbarItem from "./navbarItem";
import Heading from "../ui/heading";
import { Bell, ChevronDown, Globe, Moon, Sun } from "lucide-react";
import avatar_boy from "../../assets/images/avatar_boy.jpg";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Navbar = () => {
    const isSmall = useSelector((state: stateType) => state.isSmall);
    const isSideBarVisible = useSelector(
        (state: stateType) => state.isSideBarVisible
    );
    const theme = useSelector((state: stateType) => state.theme);
    const dispatch = useDispatch();

    const [path, setPath] = useState<string>("");
    const location = useLocation();
    const pathname = location.pathname;

    // handle theme
    const handleTheme = useCallback(() => {
        dispatch(themeAction(!theme));
    }, [dispatch, theme]);

    // handle sidebar
    const handleSideBar = useCallback(() => {
        dispatch(sideBarStudentAction(!isSideBarVisible));
    }, [dispatch, isSideBarVisible]);

    useLayoutEffect(() => {
        pathname.split("/")[2] === "dashboard"
            ? setPath("Hi Ahsan!")
            : setPath(
                pathname.split("/")[2][0].toUpperCase() +
                pathname.split("/")[2].slice(1)
            );
    }, [location]);

    // determine theme icon and text
    const themeIcon = useMemo(() => (theme ? Sun : Moon), [theme]);
    const themeText = useMemo(() => (theme ? "Light" : "Dark"), [theme]);

    return (
        <div
            className={cn(
                "sticky top-0 left-0 w-full z-40 flex justify-between items-center p-5 bg-white",
                isSmall && "shadow-custom"
            )}
        >
            {/* Heading */}
            <motion.div
                key={path}
                initial={{ opacity: 0, y: -20 }}
                animate={{
                    y: 0,
                    opacity: 1,
                    // transition: {
                    //     type: "spring",
                    //     stiffness: 400,
                    //     damping: 12,
                    //     duration: 0.3,
                    // },
                }}
                transition={{ delay: 0.2 }}
            >
                <Heading
                    className="text-2xl font-bold"
                    text={path}
                    handle={handleSideBar}
                />
            </motion.div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
                {/* Search Form */}
                <form className="hidden md:block">
                    <input
                        type="text"
                        className="border-2 border-gray-200 rounded-lg p-2 px-4 font-medium"
                        placeholder="Search"
                        aria-label="Search"
                    />
                </form>

                {/* Navbar Items */}
                <NavbarItem text="Community" Image={Globe} />
                <NavbarItem text="Notifications" Image={Bell} />
                <NavbarItem text={themeText} action={handleTheme} Image={themeIcon} />

                {/* Profile Section */}
                <div
                    className="p-2 w-[120px] h-12 rounded-full bg-zinc-100 flex items-center relative group"
                    aria-label="Profile Dropdown"
                >
                    <div className="overflow-hidden h-10 w-10 rounded-full group-hover:animate-bounce">
                        <img className="h-full w-full" src={avatar_boy} alt="User Avatar" />
                    </div>
                    <p className="font-bold flex-1 text-center truncate">AA</p>
                    <ChevronDown />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
