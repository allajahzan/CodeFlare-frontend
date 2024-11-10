import dashboard from '../../../assets/dashboard.svg'
import hub from '../../../assets/hub.svg'
import studentsMore from '../../../assets/studentsMore.svg'
import students from '../../../assets/students.svg'
import critical from '../../../assets/criticalStudents.svg'
import held from '../../../assets/heldStudents.svg'
import quality from '../../../assets/qualityStudents.svg'
import leave from '../../../assets/leave.svg'
import review from '../../../assets/review.svg'
import fumigation from '../../../assets/fumigation.svg'
import manifest from '../../../assets/manifest.svg'
import logout from '../../../assets/logout.svg'
import invoice from '../../../assets/invoice.svg'
import user from '../../../assets/user.svg'
import menu from '../../../assets/menu.svg'
import close from '../../../assets/close.svg'
import SideBarItem from '../Counsellor/SideBarItem'
import { useLocation, useNavigate } from 'react-router-dom'
import React, { useLayoutEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { stateType, resizeAction, shrinkSideBarCounsellorAction, sideBarCounsellorAction } from '../../../redux/store'
import './SideBar.css'

function SideBar() {

    const [style, setStyle] = useState<React.CSSProperties>({})
    const [showStudentDropDown, setStudentDropDown] = useState<boolean>(false)
    const [styleStudentDropDown, setStudentDropDownStyle] = useState<React.CSSProperties>({ opacity: 0 })
    const [styleBelongItems, setStyleBelowItems] = useState<React.CSSProperties>({})
    const isSmall = useSelector((state: stateType) => state.isSmall)
    const isSideBarCounsellor = useSelector((state: stateType) => state.isSideBarCounsellor)
    const isShrinkSideBarCounsellor = useSelector((state: stateType) => state.isShrinkSideBarCounsellor)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const item = (useLocation().pathname)

    const handleShrink = () => {
        dispatch(shrinkSideBarCounsellorAction(!isShrinkSideBarCounsellor))
        localStorage.setItem("isSideBarCounsellorShriked", `${!isShrinkSideBarCounsellor}`)
    }

    const handleSideBar = () => {
        dispatch(shrinkSideBarCounsellorAction(!isShrinkSideBarCounsellor))
        localStorage.setItem('isSideBarCounsellorShriked', `${!isShrinkSideBarCounsellor}`)
        dispatch(sideBarCounsellorAction(!isSideBarCounsellor))
    }

    const handlStudentDropDown = () => {
        setStudentDropDown(!showStudentDropDown)
    }

    useLayoutEffect(() => {
        setStudentDropDownStyle({
            opacity: showStudentDropDown ? 1 : 0,
            transition: 'all 0.3s ease-in-out',
            transform: showStudentDropDown ? 'translateY(0%)' : 'translateY(-100%)',
        })
        setStyleBelowItems({
            transition: 'all 0.3s ease-in-out',
            marginTop: showStudentDropDown ? '0px' : '-340px'
        })
    }, [showStudentDropDown])

    const handleSideBarItems = (event: React.MouseEvent<HTMLLIElement>) => {
        const text = !isShrinkSideBarCounsellor ? (event.currentTarget.querySelector('p') as HTMLParagraphElement)?.innerHTML.toLowerCase()
            : event.currentTarget.title.toLowerCase()

        if (text) {
            navigate(`/counsellor/${text.split(' ').join('')}`);
        }

        if (isSmall) {
            dispatch(sideBarCounsellorAction(!isSideBarCounsellor));
        }
    }

    useLayoutEffect(() => {
        const checkScreenSize = () => {
            if (window.innerWidth < 899) {
                dispatch(resizeAction(true))
            } else {
                dispatch(resizeAction(false))
                dispatch(sideBarCounsellorAction(false))
            }
        };

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, [])

    useLayoutEffect(() => {
        setStyle((prev) => {
            return {
                ...prev,
                width: isShrinkSideBarCounsellor ? '84px' : '250px'
            }
        })
    }, [isShrinkSideBarCounsellor])

    useLayoutEffect(() => {
        setStyle((prev) => {
            return {
                ...prev,
                width: isShrinkSideBarCounsellor ? '84px' : '250px',
                transform: isSmall ? 'translateX(-100%)' : 'translateX(0%)',
                opacity: 1,
                transition: 'all 0.3s ease-in-out',
            }
        })
    }, [isSmall, isShrinkSideBarCounsellor]);

    useLayoutEffect(() => {
        setStyle((prev) => {
            return {
                ...prev,
                transform: isSideBarCounsellor ? 'translateX(0%)' : isSmall ? 'translateX(-100%)' : 'translateX(0%)',
                opacity: 1,
                transition: 'all 0.3s ease-in-out',
            }
        })
    }, [isSideBarCounsellor])

    return (
        <div style={style} className={`h-full fixed top-0 left-0 flex flex-col justify-between ${isSmall ? 'bg-white shadow-xl z-30' : 'bg-white z-20'}`}>
            <div className='p-5 pr-4 flex fixed z-50 bg-white top-0 w-full items-center justify-between'>
                {/* <img className='w-32' src={logo} alt="" /> */}
                {!isShrinkSideBarCounsellor && <h1 className='text-xl overflow-hidden font-extrabold'>BootCamp</h1>}
                <img onClick={isSideBarCounsellor && isSmall ? handleSideBar : handleShrink} className='w-8 cursor-pointer' src={isSideBarCounsellor && isSmall ? close : menu} alt="" />
            </div>
            <div style={{ marginTop: '72px', marginBottom: '82px' }} className='overflow-auto overflow-x-hidden relative'>
                <div className='flex flex-col bg-white relative z-10 border-b-2'>
                    <SideBarItem color={item === '/counsellor/dashboard' ? 'bg-gray-100' : ''} image={dashboard} text='Dashboard' handleSideBarItems={handleSideBarItems} />
                    <SideBarItem color={item === '/counsellor/leaves' ? 'bg-gray-100' : ''} image={hub} text='Hub details' handleSideBarItems={handleSideBarItems} />
                </div>
                <div className='relative z-10 bg-white'>
                    <SideBarItem showStudentDropDown={showStudentDropDown} color={showStudentDropDown ? 'bg-gray-100' : ''} image={studentsMore} text='Students' handleSideBarItems={handlStudentDropDown} />
                </div>
                <div style={styleStudentDropDown} className='flex flex-col border-b-2'>
                    <SideBarItem color={item === '' ? 'bg-gray-100' : ''} image={students} text='Ongoing Students' handleSideBarItems={handleSideBarItems} />
                    <SideBarItem color={item === '/counsellor/leetcode' ? 'bg-gray-100' : ''} image={held} text='Held Students' handleSideBarItems={handleSideBarItems} />
                    <SideBarItem color={item === '' ? 'bg-gray-100' : ''} image={critical} text='Critical Students' handleSideBarItems={handleSideBarItems} />
                    <SideBarItem color={item === '/counsellor/leetcode' ? 'bg-gray-100' : ''} image={quality} text='Quality Students' handleSideBarItems={handleSideBarItems} />
                    <SideBarItem color={item === '/counsellor/leetcode' ? 'bg-gray-100' : ''} image={leave} text='Placement Cell' handleSideBarItems={handleSideBarItems} />
                </div>
                <div style={styleBelongItems} className='flex flex-col'>
                    <SideBarItem color={item === '/counsellor/manifest' ? 'bg-gray-100' : ''} image={manifest} text='Manifest' handleSideBarItems={handleSideBarItems} />
                    <SideBarItem color={item === '/counsellor/leaveReports' ? 'bg-gray-100' : ''} image={leave} text='Leave Reports' handleSideBarItems={handleSideBarItems} />
                    <SideBarItem color={item === '/counsellor/leaveReports' ? 'bg-gray-100' : ''} image={review} text='Reviews' handleSideBarItems={handleSideBarItems} />
                    <SideBarItem color={item === '/counsellor/leaveReports' ? 'bg-gray-100' : ''} image={invoice} text='Transfers' handleSideBarItems={handleSideBarItems} />
                    <SideBarItem color={item === '/counsellor/leaveReports' ? 'bg-gray-100' : ''} image={fumigation} text='Fumigation' handleSideBarItems={handleSideBarItems} />
                    <SideBarItem color={item === '' ? 'bg-gray-100' : ''} image={logout} text='Logout' />
                </div>
            </div>
            <div title={isShrinkSideBarCounsellor ? `Vidhul Counsellor` : ''} style={isShrinkSideBarCounsellor ? { padding: '25.3px 18px' } : { padding: '18px 18px' }} className='flex fixed z-50 bottom-0 w-full items-center bg-white overflow-hidden'>
                <img className='w-8' src={user} alt="" />
                <div className='ml-5 flex flex-col gap-1 text-nowrap'>
                    {!isShrinkSideBarCounsellor && <p style={{ fontSize: '15.2px' }} className='font-extrabold'>Vidhul</p>}
                    {!isShrinkSideBarCounsellor && <p style={{ fontSize: '13.2px' }} className='font-extrabold'>Counsellor</p>}
                </div>
            </div>
        </div>
    )
}

export default SideBar
