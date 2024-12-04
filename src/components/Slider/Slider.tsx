import {
    shrinkSideBarStudentAction,
    sideBarStudentAction,
    stateType,
} from "@/redux/store";
import { Grip } from "lucide-react";
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
            className="absolute z-50 top-3.5 right-1.5 p-3 cursor-pointer bg-white"
        >
            {isShrinkSideBarStudent ? <Grip /> : <Grip />}
        </div>
    );
}

export default Slider;
