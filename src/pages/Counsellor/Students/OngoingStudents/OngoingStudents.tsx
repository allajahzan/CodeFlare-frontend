import SideBar from "../../../../components/SideBar/Counsellor/SideBar"
import students from '../../../../assets/students.svg'
import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { stateType } from "../../../../redux/store";
import DropDown from "../../../../components/DropDowns/Counsellor/DropDown";
import Header from "../../../../components/Table/DataTable/Header";
import Body from "../../../../components/Table/DataTable/Body";
import ContentHeadingInSmallSize from "../../../../components/Headings/Counsellor/ContentHeadingInSmallSize";
import ContentHeading from "../../../../components/Headings/ContentHeading";
import Shadow from "../../../../components/Shadow/Shadow";

function OngoingStudents() {

    const [style, setStyle] = useState<React.CSSProperties>({ transition: 'all 0.3s ease-in-out' });
    const [isOpenBatchDropDown, setIsOpenBatchDropDown] = useState(false);
    const [isOpenWeekDropDown, setIsOpenWeekDropDown] = useState(false);
    const [isOpenDomainDropDown, setIsOpenDomainDropDown] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState('Select Batch');
    const [selectedWeek, setSelectedWeek] = useState('Select Week');
    const [selectedDomain, setSelectedDomain] = useState('Select Domain');
    const [batches, setBatches] = useState<string[] | null>()
    const [weeks, setWeeks] = useState<string[] | null>()
    const [domain, setDomains] = useState<string[] | null>()
    const isSmall = useSelector((state: stateType) => state.isSmall);
    const isShrinkSideBarCounsellor = useSelector((state: stateType) => state.isShrinkSideBarCounsellor)

    const handleBatch = (value: string) => {
        setSelectedBatch(value);
        setIsOpenBatchDropDown(false);
    };

    const handleWeek = (value: string) => {
        setSelectedWeek(value);
        setIsOpenWeekDropDown(false);
    };

    const handleDomain = (value: string) => {
        setSelectedDomain(value);
        setIsOpenDomainDropDown(false);
    };


    useLayoutEffect(() => {
        setStyle(prevStyle => ({
            ...prevStyle,
            paddingTop: isShrinkSideBarCounsellor ? isSmall ? '0px' : '0px' : isSmall ? '0px' : '20px',
            paddingLeft: isShrinkSideBarCounsellor ? isSmall ? '0px' : '68px' : isSmall ? '0px' : '250px'
        }));
    }, [isShrinkSideBarCounsellor, isSmall])

    useLayoutEffect(() => {
        setBatches(['All Batches', 'BCK 188', 'BCK 189'])
        setWeeks(['All Weeks', 'Week 23', 'Week 24'])
        setDomains(['All Domains', 'MERN Stack', 'MEAN Stack', 'Python Django', '.Net', 'Flutter'])
    }, [])

    return (
        <div>
            <Shadow />
            <div className='flex h-[100vh]'>
                <SideBar />
                <div style={style} className='w-full'>
                    <div style={{ borderWidth: isSmall ? '0px' : '6px 0px 0px 6px', boxShadow: '0.01rem 0.05rem 1rem 0.2rem #eeeeee', backgroundColor: '#f5f5f5', padding: '20px', paddingTop: isSmall ? '14px' : '20px' }}
                        className='w-full h-full flex flex-col gap-y-4 border-white rounded-tl-lg  relative z-20'>

                        <ContentHeadingInSmallSize />

                        <div className='flex justify-between items-start relative'>
                            <ContentHeading image={students} text='Ongoing students' />
                        </div>

                        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {/* batch drop down */}
                            <DropDown datas={batches as string[]} selectedItem={selectedBatch} setStateVariable1={setIsOpenBatchDropDown} setStateVariable2={setIsOpenWeekDropDown} setStateVariable3={setIsOpenDomainDropDown} stateVariable={isOpenBatchDropDown} handleFunction={handleBatch} />
                            {/* week drop down */}
                            <DropDown datas={weeks as string[]} selectedItem={selectedWeek} setStateVariable1={setIsOpenWeekDropDown} setStateVariable2={setIsOpenBatchDropDown} setStateVariable3={setIsOpenDomainDropDown} stateVariable={isOpenWeekDropDown} handleFunction={handleWeek} />
                            {/* week drop down */}
                            <DropDown datas={domain as string[]} selectedItem={selectedDomain} setStateVariable1={setIsOpenDomainDropDown} setStateVariable2={setIsOpenWeekDropDown} setStateVariable3={setIsOpenBatchDropDown} stateVariable={isOpenDomainDropDown} handleFunction={handleDomain} />
                        </div>

                        <div className="w-full">
                            <input placeholder="Search students" name="search students" type="text" className="w-full bg-white p-3 bg-transparent border-2 border-black border-opacity-10 font-medium rounded-lg" autoComplete="off" />
                        </div>

                        <div className='overflow-x-auto flex-grow'>
                            <div className='flex flex-col h-full rounded-lg' style={{ minWidth: '1000px' }}>
                                {/* Table Rows */}
                                <div className="flex-1 overflow-y-auto">
                                    <div className="sticky top-0 -z-10 bg-white">
                                        <Header />
                                    </div>
                                    <div className="flex flex-col gap-2 relative -z-20">
                                        {[1, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, index) => (
                                            <Body key={index} index={index + 1} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default OngoingStudents
