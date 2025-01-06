import { useSelector } from "react-redux";
import { stateType } from "../../redux/store";
import { cn } from "@/lib/utils";

function Shadow() {
    const isSideBarVisible = useSelector(
        (state: stateType) => state.isSideBarVisible
    );
    const isSmall = useSelector((state: stateType) => state.isSmall);

    return (
        <div
            className={cn(
                isSmall &&
                isSideBarVisible &&
                "bg-black bg-opacity-20 absolute z-50 top-0 left-0 h-screen w-screen transition-all duration-300"
            )}
        ></div>
    );
}

export default Shadow;
