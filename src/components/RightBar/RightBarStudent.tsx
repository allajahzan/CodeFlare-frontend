import { LogOut, Settings, Moon, Sun, FolderOpen, Bell, UserRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { stateType, themeAction } from "../../redux/store";
import { useCallback } from "react";
import RightBarItem from "./RightBarItem";

function RightBarStudent() {
    const isShrinkSideBarStudent = useSelector(
        (state: stateType) => state.isShrinkSideBarStudent
    );
    const theme = useSelector((state: stateType) => state.theme);
    const dispath = useDispatch();

    const handleTheme = useCallback(() => {
        dispath(themeAction(!theme));
    }, [theme]);

    return (
        <div
            style={{ transition: "all 0.3s ease-in-out" }}
            className={`fixed h-full flex flex-col items-center justify-start right-0 w-[60px] ${isShrinkSideBarStudent ? "mt-1" : "mt-5"}`}
        >
            <RightBarItem
                text={theme ? 'Light' : 'Dark'}
                action={handleTheme}
                children={theme ? <Sun /> : <Moon />}
            />
            <RightBarItem text="Notifications" children={<Bell />} />
            <RightBarItem text="Folders" children={<FolderOpen />} />
            <RightBarItem text="Settings" children={<Settings />} />
            <RightBarItem text="Account" children={<UserRound />} />
            <RightBarItem text="Logout" children={<LogOut />} />
        </div>
    );
}

export default RightBarStudent;
