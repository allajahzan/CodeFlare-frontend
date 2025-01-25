import { useDispatch, useSelector } from "react-redux";
import { sideBarVisibilityAction, stateType } from "@//redux/store";
import { cn } from "@/lib/utils";

function Shadow() {
    const isSideBarVisible = useSelector(
        (state: stateType) => state.isSideBarVisible
    );
    const isSmall = useSelector((state: stateType) => state.isSmall);

    const dispatch = useDispatch();

    // Hide sidebar
    const handleSideBar = () => {
        dispatch(sideBarVisibilityAction(false));
    };

    return (
        <div
            onClick={handleSideBar}
            className={cn(
                isSmall &&
                isSideBarVisible &&
                "bg-black/80 absolute z-50 top-0 left-0 h-screen w-screen transition-all duration-300"
            )}
        ></div>
    );
}

export default Shadow;
