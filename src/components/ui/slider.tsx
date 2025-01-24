import React, { useCallback } from "react";
import { sideBarVisibilityAction, stateType } from "@/redux/store";
import { CircleChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

function Slider() {
  const isSideBarVisible = useSelector(
    (state: stateType) => state.isSideBarVisible
  );
  const dispatch = useDispatch();

  // sidebar toggle
  const handleToggle = useCallback(() => {
    dispatch(sideBarVisibilityAction(!isSideBarVisible));
  }, [dispatch, isSideBarVisible]);

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle Sidebar"
      className="absolute z-50 top-[6.3%] translate-y-[-50%] -right-1 h-10 w-10 bg-white rounded-full shadow-lg flex justify-center items-center cursor-pointer"
    >
      <CircleChevronLeft className="w-5 h-5" />
    </button>
  );
}

export default React.memo(Slider);
