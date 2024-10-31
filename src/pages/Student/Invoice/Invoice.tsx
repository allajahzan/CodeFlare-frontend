import Navbar from '../../../components/Navbar/Navbar'
import SideBar from '../../../components/SideBar/Student/SideBar'
import invoice from '../../../assets/invoice.svg'
import InvoiceTable from '../../../components/Table/InvoiceTable/InvoiceTable'
import { useLayoutEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { stateType } from '../../../redux/store'

function Invoice() {

    const [style, setStyle] = useState<React.CSSProperties>({
        padding: '20px',
        paddingLeft: '320px',
        paddingTop: '140px',
        transition: 'all 0.3s ease-in-out',
    });

    const isSmall = useSelector((state: stateType) => state.isSmall);

    useLayoutEffect(() => {
        setStyle(prevStyle => ({
            ...prevStyle,
            paddingLeft: isSmall ? '20px' : '320px',
        }));
    }, [isSmall]);

    return (
        <div>
            <Navbar />
            <div className='flex h-[100vh]'>
                <SideBar />
                <div style={style} className='w-full'>
                    <div className='flex items-start fixed top-24 '>
                        <img className='w-8' src={invoice} alt="" />
                        <p className='text-black font-bold text-lg tracking-wider ml-3 uppercase underline underline-offset-4'>Invoices</p>
                    </div>
                    <InvoiceTable />
                </div>
            </div>
        </div>
    )
}

export default Invoice
