import SideBar from "../../../components/SideBar/Student/SideBar";
import dashboard from "../../../assets/icons/dashboard.svg";
import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { stateType } from "../../../redux/store";
import Shadow from "../../../components/Shadow/Shadow";
import ContentHeadingInSmallSize from "../../../components/Headings/Student/ContentHeadingInSmallSize";
import ContentHeading from "../../../components/Headings/ContentHeading";
import RightBarStudent from "../../../components/RightBar/RightBarStudent";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import Slider from "@/components/Slider/Slider";

const calculatePadding = (
  isShrink: boolean,
  isSmall: boolean
): React.CSSProperties => {
  return {
    paddingTop: isSmall ? "70px" : isShrink ? "0px" : "20px",
    paddingLeft: isSmall ? "20px" : isShrink ? "60px" : "240px",
    paddingRight: "60px",
  };
};

const containerStyles: React.CSSProperties = {
  borderWidth: "6px 6px 0px 6px",
  boxShadow: "0.01rem 0.05rem 1rem 0.2rem #eeeeee",
  backgroundColor: "#f5f5f5",
  padding: "20px",
};

function Dashboard() {
  const [style, setStyle] = useState<React.CSSProperties>({
    transition: "all 0.3s ease-in-out",
  });
  const isShrinkSideBarStudent = useSelector(
    (state: stateType) => state.isShrinkSideBarStudent
  );
  const isSmall = useSelector((state: stateType) => state.isSmall);

  useLayoutEffect(() => {
    setStyle((prevStyle) => ({
      ...prevStyle,
      ...calculatePadding(isShrinkSideBarStudent, isSmall),
    }));
  }, [isShrinkSideBarStudent, isSmall]);

  return (
    <div>
      <Shadow />
      <div className="flex h-[100vh]">
        <SideBar />
        <div style={style} className="w-full">
          <ContentHeadingInSmallSize />
          <div
            style={containerStyles}
            className="w-full h-full flex flex-col gap-y-4 border-white rounded-t-xl  relative z-20"
          >
            <div className="flex justify-between items-start relative">
              <ContentHeading image={dashboard} text="Dashboard" />
            </div>
          </div>
        </div>
        <RightBarStudent />
      </div>
    </div>
  );
}

export default Dashboard;
