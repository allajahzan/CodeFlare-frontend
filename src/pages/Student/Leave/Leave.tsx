import Navbar from '../../../components/Navbar/Navbar'
import SideBar from '../../../components/SideBar/Student/SideBar'
import leave from '../../../assets/leave.svg'
import { useLayoutEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { stateType } from '../../../redux/store'
import LeaveModal from '../../../components/LeaveModal/LeaveModal'
import Header from '../../../components/Table/DataTable/Header'
import Body from '../../../components/Table/DataTable/Body'

function Leave() {

    const [style, setStyle] = useState<React.CSSProperties>({
        padding: '20px',
        paddingLeft: '320px',
        paddingTop: '215px',
        transition: 'all 0.3s ease-in-out',
    });

    const isSmall = useSelector((state: stateType) => state.isSmall);

    useLayoutEffect(() => {
        setStyle(prevStyle => ({
            ...prevStyle,
            paddingLeft: isSmall ? '20px' : '320px'
        }));
    }, [isSmall]);

    const [openModal, setOpenModal] = useState<boolean>(false);

    return (
        <div>
            <Navbar />
            <div className='flex h-[100vh]'>
                <SideBar />
                <div style={style} className='w-full'>
                    <div style={isSmall ? { width: 'calc(100% - 40px)' } : { width: 'calc(100% - 340px)' }} className='flex-col items-center fixed top-24'>
                        <div className='flex justify-between'>
                            <div className='flex items-start'>
                                <img className='w-8' src={leave} alt="" />
                                <p className='text-black font-bold text-lg tracking-wider ml-3 uppercase underline underline-offset-4'>Leaves</p>
                            </div>
                            <div>
                                <button onClick={() => setOpenModal(!openModal)} style={{ backgroundColor: 'black' }} className='p-2 py-2 px-8 rounded-md bg-black text-white font-medium mb-1'>Apply</button>
                            </div>                                                                              
                        </div>
                        <div className='pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-5'>
                            <select name='type' className='p-3 bg-transparent border-2 border-black border-opacity-20 font-medium rounded-lg outline-none'>
                                <option hidden>Abscence Type</option>
                                <option value="leave">Leave</option>
                                <option value="late">Late</option>
                            </select>
                            <input name='startDate' className='p-2 sm:p-3 bg-transparent border-2 border-black border-opacity-20 font-medium rounded-lg outline-none' type="date" />
                            <input name='endDate' className='p-2 sm:p-3 bg-transparent border-2 border-black border-opacity-20 font-medium rounded-lg outline-none' type="date" />
                        </div>
                    </div>

                    {/* leaves table */}
                    <div className='overflow-x-auto h-full pt-24 sm:pt-0'>
                        <div className='flex flex-col h-full' style={isSmall ? { minWidth: '1000px' } : {}}>
                            <div className="sticky top-0 z-10 bg-white">
                                <Header />
                            </div>
                            {/* Table Rows */}
                            <div className="flex-1 overflow-y-auto">
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
