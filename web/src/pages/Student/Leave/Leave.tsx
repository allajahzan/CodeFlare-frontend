import SideBar from "../../../components/SideBar/Student/SideBar";
import leave from "../../../assets/icons/leave.svg";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { stateType } from "../../../redux/store";
import LeaveModal from "../../../components/LeaveModal/LeaveModal";
import Header from "../../../components/Table/DataTable/Header";
import Body from "../../../components/Table/DataTable/Body";
import DropDown from "../../../components/DropDowns/Counsellor/DropDown";
import ContentHeading from "../../../components/Headings/ContentHeading";
import ContentHeadingInSmallSize from "../../../components/Headings/Student/ContentHeadingInSmallSize";
import Shadow from "../../../components/Shadow/Shadow";
import '../Student.css'

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

function Leave() {

    const [style, setStyle] = useState<React.CSSProperties>({transition: "all 0.3s ease-in-out"});
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [leaveTypes, setLeaveTypes] = useState<string[]>([]);
    const [selectedType, setSelectedType] = useState<string>("Abscence Type");
    const [isOpenDropDown, setIsOpenDropDown] = useState<boolean>(false);
    const isSmall = useSelector((state: stateType) => state.isSmall);
    const isShrinkSideBarStudent = useSelector((state: stateType) => state.isShrinkSideBarStudent);

    const handleDropDown = (item: string) => {
        setSelectedType(item);
        setIsOpenDropDown(false);
    };

    useEffect(() => {
        setLeaveTypes(["Leave", "Late"]);
    }, []);

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
                <div style={style} className="w-full bg-white">
                    <ContentHeadingInSmallSize />

                    <div
                        style={containerStyles}
                        className="container_style"
                    >
                        <div className="flex justify-between items-start relative">
                            <ContentHeading image={leave} text="Leaves" />
                            <button
                                onClick={() => setOpenModal(!openModal)}
                                className="p-2 py-2 px-8 absolute right-0 -top-1 rounded-md bg-black shadow-2xl text-white tracking-wider font-medium uppercase"
                            >
                                Apply
                            </button>
                        </div>

                        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <DropDown
                                datas={leaveTypes}
                                selectedItem={selectedType}
                                setStateVariable1={setIsOpenDropDown}
                                stateVariable={isOpenDropDown}
                                handleFunction={handleDropDown}
                            />
                            <input
                                name="startDate"
                                className="p-3 bg-white  border-2 border-black border-opacity-10 font-medium rounded-lg outline-none outline-offset-0"
                                type="date"
                            />
                            <input
                                name="endDate"
                                className="p-3 bg-white border-2 border-black border-opacity-10 font-medium rounded-lg outline-none outline-offset-0"
                                type="date"
                            />
                        </div>

                        {/* leaves table */}
                        <div className="overflow-x-auto h-full">
                            <div className="flex h-full" style={{ minWidth: "1000px" }}>
                                {/* Table Rows */}
                                <div className="flex-1 overflow-y-auto">
                                    <div className="sticky top-0 z-10 bg-white">
                                        <Header />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 10].map((_, index) => (
                                            <Body key={index} index={index} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <LeaveModal openModal={openModal} setOpenModal={setOpenModal} />
                </div>
                <RightBarStudent/>
            </div>
        </div>
    );
}

export default Leave;
