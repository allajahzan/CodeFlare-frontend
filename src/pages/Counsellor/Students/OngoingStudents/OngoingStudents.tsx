import Navbar from "../../../../components/Navbar/Navbar"
import SideBar from "../../../../components/SideBar/Counsellor/SideBar"
import students from '../../../../assets/students.svg'
import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { stateType } from "../../../../redux/store";
import DropDown from "../../../../components/DropDowns/Counsellor/DropDown";
import Header from "../../../../components/Table/DataTable/Header";
import Body from "../../../../components/Table/DataTable/Body";

function OngoingStudents() {

    const [style, setStyle] = useState<React.CSSProperties>({
        padding: '20px',
        paddingLeft: '320px',
        paddingTop: '215px',
        transition: 'all 0.3s ease-in-out',
    });
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
            paddingLeft: isSmall ? '20px' : '320px'
        }));
    }, [isSmall]);

    useLayoutEffect(() => {
        setBatches(['BCK 188', 'BCK 189'])
        setWeeks(['Week 23', 'Week 24'])
        setDomains(['MERN Stack', 'MEAN Stack', 'Python Django', '.Net', 'Flutter'])
    }, [])

    return (
        <div className='flex h-[100vh]'>
            <Navbar />
            <SideBar />
            <div style={style} className='w-full space-y-2.5 sm:space-y-0'>
                <div style={isSmall ? { width: 'calc(100% - 40px)' } : { width: 'calc(100% - 340px)' }} className='flex-col items-center fixed top-24'>
                    <div className='flex justify-between'>
                        <div className='flex items-start'>
                            <img className='w-8' src={students} alt="" />
                            <p className='text-black font-bold text-lg tracking-wider ml-3 uppercase underline underline-offset-4'>Ongoing students</p>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 py-4">
                        {/* batch drop down */}
                        <DropDown datas={batches as string[]} selectedItem={selectedBatch} setStateVariable1={setIsOpenBatchDropDown} setStateVariable2={setIsOpenWeekDropDown} setStateVariable3={setIsOpenDomainDropDown} stateVariable={isOpenBatchDropDown} handleFunction={handleBatch} />
                        {/* week drop down */}
                        <DropDown datas={weeks as string[]} selectedItem={selectedWeek} setStateVariable1={setIsOpenWeekDropDown} setStateVariable2={setIsOpenBatchDropDown} setStateVariable3={setIsOpenDomainDropDown} stateVariable={isOpenWeekDropDown} handleFunction={handleWeek} />
                        {/* week drop down */}
                        <DropDown datas={domain as string[]} selectedItem={selectedDomain} setStateVariable1={setIsOpenDomainDropDown} setStateVariable2={setIsOpenWeekDropDown} setStateVariable3={setIsOpenBatchDropDown} stateVariable={isOpenDomainDropDown} handleFunction={handleDomain} />
                    </div>
                </div>

                <div className='overflow-x-auto h-full pt-24 sm:pt-0'>
                    <div className='flex flex-col h-full' style={isSmall ? { minWidth: '1000px' } : {}}>
                        <div className="sticky top-0 -z-10 bg-white">
                            <Header />
                        </div>
                        {/* Table Rows */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex flex-col gap-2">
                                {[1, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((_, index) => (
                                    <Body key={index} index={index} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default OngoingStudents
