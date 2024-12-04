import {
    shrinkSideBarStudentAction,
    sideBarStudentAction,
    stateType,
} from "@/redux/store";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
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
            className="absolute z-50 -left-4 top-1/2 transform -translate-y-1/2"
        >
            {isShrinkSideBarStudent ? <PanelRightClose /> : <PanelRightOpen />}
        </div>
    );
}

export default Slider;
