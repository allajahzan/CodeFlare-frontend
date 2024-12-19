import { sideBarStudentAction, stateType } from "@/redux/store";
import { CircleChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

function Slider() {
    const isSideBarStudent = useSelector(
        (state: stateType) => state.isSideBarStudent
    );
    const dispatch = useDispatch();

    const handle = () => {
        dispatch(sideBarStudentAction(!isSideBarStudent));
    };
    return (
        <div
            onClick={handle}
            className={`absolute z-50 top-[17%] translate-y-[-50%] -right-1 h-10 w-10 bg-white rounded-full shadow-lg flex justify-center items-center cursor-pointer`}
        >
            <CircleChevronLeft className="text-black w-5" />
        </div>
    );
}

export default Slider;
