import React, { useCallback } from "react";
import { sideBarStudentAction, stateType } from "@/redux/store";
import { CircleChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

function Slider() {
  const isSideBarStudent = useSelector(
    (state: stateType) => state.isSideBarStudent
  );
  const dispatch = useDispatch();

  // sidebar toggle
  const handleToggle = useCallback(() => {
    dispatch(sideBarStudentAction(!isSideBarStudent));
  }, [dispatch, isSideBarStudent]);

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle Sidebar"
      className="absolute z-50 top-[6.3%] translate-y-[-50%] -right-1 h-10 w-10 bg-white rounded-full shadow-lg flex justify-center items-center cursor-pointer"
    >
      <CircleChevronLeft className="text-black w-5" />
    </button>
  );
}

export default React.memo(Slider);
