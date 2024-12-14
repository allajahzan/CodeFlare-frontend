import {
    shrinkSideBarStudentAction,
    sideBarStudentAction,
    stateType,
} from "@/redux/store";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

function Slider() {
    const isShrinkSideBarStudent = useSelector(
        (state: stateType) => state.isShrinkSideBarStudent
    );
    const isSideBarStudent = useSelector(
        (state: stateType) => state.isSideBarStudent
    );
    const isSmall = useSelector((state: stateType) => state.isSmall);
    const dispatch = useDispatch();

    const handleShrink = () => {
        const newShrinkState = !isShrinkSideBarStudent;
        dispatch(shrinkSideBarStudentAction(newShrinkState));
        localStorage.setItem("isSideBarStudentShriked", String(newShrinkState));
    };

    const handleSideBarToggle = () => {
        dispatch(sideBarStudentAction(!isSideBarStudent));
    };
    return (
        <div
            onClick={isSideBarStudent && isSmall ? handleSideBarToggle : handleShrink}
            className={`absolute z-50 top-[18%] translate-y-[-50%] -right-1 h-10 w-10 bg-white rounded-full shadow-lg flex justify-center items-center cursor-pointer`}
        >
            {isShrinkSideBarStudent? <CircleChevronRight className="text-black w-5" /> : <CircleChevronLeft className="text-black w-5" />}
        </div>
    );
}

export default Slider;
