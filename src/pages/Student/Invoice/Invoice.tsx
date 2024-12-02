import SideBar from '../../../components/SideBar/Student/SideBar'
import invoice from '../../../assets/icons/invoice.svg'
import InvoiceTable from '../../../components/Table/InvoiceTable/InvoiceTable'
import { useLayoutEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { stateType } from '../../../redux/store'
import Shadow from '../../../components/Shadow/Shadow'
import ContentHeadingInSmallSize from '../../../components/Headings/Student/ContentHeadingInSmallSize'
import ContentHeading from '../../../components/Headings/ContentHeading'

function Invoice() {

    const [style, setStyle] = useState<React.CSSProperties>({ transition: 'all 0.3s ease-in-out' });

    const isSmall = useSelector((state: stateType) => state.isSmall);
    const isShrinkSideBarStudent = useSelector((state: stateType) => state.isShrinkSideBarStudent)

    useLayoutEffect(() => {
        setStyle(prevStyle => ({
            ...prevStyle,
            paddingTop: isShrinkSideBarStudent ? isSmall ? '70px' : '0px' : isSmall ? '70px' : '20px',
            paddingLeft: isShrinkSideBarStudent ? isSmall ? '20px' : '68px' : isSmall ? '20px' : '250px'
        }));
    }, [isShrinkSideBarStudent, isSmall])

    return (
        <div>
            <Shadow />
            <div className='flex h-[100vh]'>
                <SideBar />
                <div style={style} className='w-full'>

                    <ContentHeadingInSmallSize />

                    <div style={{ borderWidth: '6px 0px 0px 6px', boxShadow: '0.01rem 0.05rem 1rem 0.2rem #eeeeee', backgroundColor: '#f5f5f5', padding: '20px' }}
                        className='w-full h-full flex flex-col gap-y-4 border-white rounded-tl-lg  relative z-20'>

                        <div className='flex justify-between items-start relative'>
                            <ContentHeading image={invoice} text='Invoices' />
                        </div>

                        <InvoiceTable />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Invoice
