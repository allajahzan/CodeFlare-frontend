import {
    useCallback,
    useContext,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { sideBarVisibilityAction, stateType } from "@/redux/store";
import NavbarItem from "./navbar-item";
import Heading from "@/components/ui/heading";
import {
    Bell,
    Globe,
    Search,
    Moon,
    Sun,
    ChevronDown,
    Dot,
    ChevronLeft,
} from "lucide-react";
import avatar_boy from "@/assets/images/avatar_boy.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { IThemeContext, ThemeContext } from "@/context/theme-context";
import { IUserContext, UserContext } from "@/context/user-context";

// Navbar Component
const Navbar = () => {
    //Redux
    const isSideBarVisible = useSelector(
        (state: stateType) => state.isSideBarVisible
    );
    const role = useSelector((state: stateType) => state.role);

    const dispatch = useDispatch();

    // Theme context
    const { theme, setTheme } = useContext(ThemeContext) as IThemeContext;

    // User context
    const { user } = useContext(UserContext) as IUserContext;

    // Naviagate
    const navigate = useNavigate();

    // Path
    const [path, setPath] = useState<string>("");
    const location = useLocation();
    const pathname = location.pathname;

    // Handle theme
    const handleTheme = useCallback(() => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    }, [theme]);

    // Handle sidebar
    const handleSideBar = useCallback(() => {
        dispatch(sideBarVisibilityAction(!isSideBarVisible));
    }, [dispatch, isSideBarVisible]);

    // Set page heading
    useLayoutEffect(() => {
        pathname.split("/")[2] === "dashboard"
            ? setPath(`Hi, ${user?.name as string}!`)
            : pathname.split("/")[2] === "meet"
                ? setPath("Meet")
                : setPath(
                    pathname.split("/")[2][0].toUpperCase() +
                    pathname.split("/")[2].slice(1)
                );
    }, [location]);

    // Determine theme icon and text
    const themeIcon = useMemo(() => (theme === "light" ? Sun : Moon), [theme]);
    const themeText = useMemo(
        () => (theme === "light" ? "Light" : "Dark"),
        [theme]
    );

    return (
        <div
            className={cn(
                "sticky top-0 left-0 w-full z-40 flex justify-between items-center p-5",
                pathname.split("/")[2] === "meet" && "pr-[19px]"
            )}
        >
            <div className="flex items-center gap-2">
                {/* Go back */}
                {pathname.split("/")[2] === "meet" && (
                    <button onClick={() => navigate(-1)} className="p-2">
                        <ChevronLeft className="w-5 h-5 text-foreground" />
                    </button>
                )}

                {/* Heading */}
                <motion.div
                    key={path}
                    initial={{
                        opacity: pathname.split("/")[2] === "meet" ? 1 : 0,
                        y: pathname.split("/")[2] === "meet" ? 0 : -20,
                    }}
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
                        className="text-2xl text-foreground font-bold"
                        text={path}
                        handle={handleSideBar}
                    />
                </motion.div>
            </div>

            {/* Right Section */}
            <div className="flex items-center sm:gap-3 gap-4">
                {/* Search Form on non-meet pages */}
                {pathname.split("/")[2] !== "meet" && (
                    <form className="hidden md:block">
                        <div className="relative">
                            <Input
                                id="search"
                                type="search"
                                placeholder="Search"
                                autoComplete="off"
                                required
                                className="p-5 pl-9 text-foreground font-medium rounded-lg shadow-sm"
                            />
                            <Search className="w-4 h-4 absolute left-3 top-[13px] text-muted-foreground" />
                        </div>
                    </form>
                )}

                {/* Date on meet page */}
                {pathname.split("/")[2] === "meet" && (
                    <div className="px-5 hidden md:block">
                        <p className="flex items-center text-muted-foreground font-medium text-lg">
                            {new Date().toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            })}{" "}
                            <Dot className="text-muted-foreground" />
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                )}

                {/* Navbar Items */}
                {pathname.split("/")[2] !== "meet" && (
                    <>
                        <NavbarItem text="Community" Image={Globe} />
                        <NavbarItem text="Notifications" Image={Bell} />
                    </>
                )}

                <NavbarItem text={themeText} action={handleTheme} Image={themeIcon} />

                {/* Profile Section */}
                <div
                    onClick={() => navigate(`/${role}/profile`)}
                    className="group relative p-2 w-[120px] h-12 flex items-center rounded-full bg-muted"
                    aria-label="Profile Dropdown"
                >
                    <div className="overflow-hidden h-10 w-10 rounded-full group-hover:animate-bounce">
                        <img className="h-full w-full" src={avatar_boy} alt="User Avatar" />
                    </div>
                    <p
                        className={`flex-1 text-center text-foreground font-bold truncate ${pathname.split("/")[2] === "meet" && "relative -left-[0.5px]"
                            }`}
                    >
                        {(() => {
                            const [first, second] = (user?.name as string).split(" ");
                            return second
                                ? first[0].toUpperCase() + second[0].toUpperCase()
                                : first.slice(0, 2).toUpperCase();
                        })()}
                    </p>
                    <ChevronDown className="text-foreground" />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
