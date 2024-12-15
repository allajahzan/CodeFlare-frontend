import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stateType, themeAction } from "../../redux/store";
import NavbarItem from "./NavbarItem";
import Heading from "../ui/Heading";
import { Bell, ChevronDown, Globe, Moon, Sun } from "lucide-react";
import avatar_boy from "../../assets/images/avatar_boy.jpg";

const Navbar = () => {
    const theme = useSelector((state: stateType) => state.theme);
    const dispatch = useDispatch();

    const handleTheme = useCallback(() => {
        dispatch(themeAction(!theme));
    }, [dispatch, theme]);

    const themeIcon = useMemo(() => (theme ? Sun : Moon), [theme]);
    const themeText = useMemo(() => (theme ? "Light" : "Dark"), [theme]);

    return (
        <div className="sticky top-0 w-full z-50 flex justify-between items-center p-6 bg-white">
            {/* Heading */}
            <Heading className="text-2xl font-bold text-zinc-900" text="Good morning, Ahsan!" />

            {/* Right Section */}
            <div className="flex items-center gap-2">
                {/* Search Form */}
                <form>
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
                    className="p-2 w-[120px] h-12 rounded-full bg-zinc-100 flex items-center gap-2 relative"
                    aria-label="Profile Dropdown"
                >
                    <div className="overflow-hidden h-10 w-10 rounded-full">
                        <img className="h-full w-full" src={avatar_boy} alt="User Avatar" />
                    </div>
                    <p className="font-bold text-black flex-1 text-center text-ellipsis overflow-hidden">
                        AA
                    </p>
                    <ChevronDown />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
