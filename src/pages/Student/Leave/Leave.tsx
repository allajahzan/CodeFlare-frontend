import Navbar from '../../../components/Navbar/Navbar'
import SideBar from '../../../components/SideBar/Student/SideBar'
import leave from '../../../assets/leave.svg'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { stateType } from '../../../redux/store'
import LeaveModal from '../../../components/LeaveModal/LeaveModal'
import Header from '../../../components/Table/DataTable/Header'
import Body from '../../../components/Table/DataTable/Body'
import DropDown from '../../../components/DropDowns/Counsellor/DropDown'

function Leave() {

    const [style, setStyle] = useState<React.CSSProperties>({
        padding: '20px',
        paddingTop: '96px',
        transition: 'all 0.3s ease-in-out',
    });
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [leaveTypes, setLeaveTypes] = useState<string[]>([])
    const [selectedType, setSelectedType] = useState<string>('Abscence Type')
    const [isOpenDropDown, setIsOpenDropDown] = useState<boolean>(false)
    const isSmall = useSelector((state: stateType) => state.isSmall);

    const handleDropDown = (item: string) => {
        setSelectedType(item)
        setIsOpenDropDown(false)
    }

    useEffect(() => {
        setLeaveTypes(['Leave', 'Late'])
    }, [])

    useLayoutEffect(() => {
        setStyle(prevStyle => ({
            ...prevStyle,
            paddingLeft: isSmall ? '20px' : '320px'
        }));
    }, [isSmall]);

    return (
        <div>
            <Navbar />
            <div className='flex h-[100vh]'>
                <SideBar />
                <div style={style} className='w-full flex flex-col gap-y-4'>

                    <div className='flex justify-between relative'>
                        <div className='flex items-start'>
                            <img className='w-8' src={leave} alt="" />
                            <p className='text-black font-bold text-lg tracking-wider ml-3 uppercase underline underline-offset-4'>Leaves</p>
                        </div>
                        <div className='absolute right-0 top-0'>
                            <button onClick={() => setOpenModal(!openModal)} style={{ backgroundColor: 'black' }} className='p-2 py-2 px-8 rounded-md bg-black text-white font-medium'>Apply</button>
                        </div>
                    </div>

                    <div className='w-full grid grid-cols-1 sm:grid-cols-3 gap-2'>
                        <DropDown datas={leaveTypes} selectedItem={selectedType} setStateVariable1={setIsOpenDropDown} stateVariable={isOpenDropDown} handleFunction={handleDropDown} />
                        {/* <input name='startDate' className='p-3 bg-transparent border-2 border-black border-opacity-20 font-medium rounded-lg outline-none outline-offset-0' type="date" /> */}
                        {/* <input name='endDate' className='p-3 bg-transparent border-2 border-black border-opacity-20 font-medium rounded-lg outline-none outline-offset-0'type="date" /> */}
                    </div>

                    {/* leaves table */}
                    <div className='overflow-x-auto h-full'>
                        <div className='flex flex-col h-full' style={isSmall ? { minWidth: '1000px' } : {}}>
                            {/* Table Rows */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="sticky top-0 z-10 bg-white">
                                    <Header />
                                </div>
                                <div className="flex flex-col gap-2">
                                    {[1, 2, 3].map((_, index) => (
                                        <Body key={index} index={index} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <LeaveModal openModal={openModal} setOpenModal={setOpenModal} />

                </div>
            </div>
        </div>
    )
}

export default Leave
