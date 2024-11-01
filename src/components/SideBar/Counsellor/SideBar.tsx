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
import SideBarItem from '../SideBarItem'
import { useLocation, useNavigate } from 'react-router-dom'
import React, { useLayoutEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { stateType, resizeAction, sideBarAction } from '../../../redux/store'
import './SideBar.css'

function SideBar() {

    const [style, setStyle] = useState<React.CSSProperties>({})
    const [showStudentDropDown, setStudentDropDown] = useState<boolean>(false)
    const [styleStudentDropDown, setStudentDropDownStyle] = useState<React.CSSProperties>({ opacity: 0 })
    const [styleBelongItems, setStyleBelowItems] = useState<React.CSSProperties>({})
    const isSmall = useSelector((state: stateType) => state.isSmall)
    const isSideBar = useSelector((state: stateType) => state.isSideBar)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const item = (useLocation().pathname)

    // handle side bar item navigation
    const handleSideBarItems = (event: React.MouseEvent<HTMLDivElement>) => {
        const text = (event.currentTarget.querySelector('p') as HTMLParagraphElement)?.innerHTML.toLowerCase();

        if (text) {
            if (text.split(' ').length == 2)
                navigate(`/counsellor/${(text.split(' ')[0] + text.split(' ')[1]).toLowerCase()}`);
            else
                navigate(`/counsellor/${text}`)
        }

        if (isSmall) {
            dispatch(sideBarAction(!isSideBar));
        }
    }

    // handle student drop down
    const handlStudentDropDown = () => {
        setStudentDropDown(!showStudentDropDown)
    }

    useLayoutEffect(() => {
        setStudentDropDownStyle({
            opacity: 1,
            transition: 'all 0.3s ease-in-out',
            transform: showStudentDropDown ? 'translateY(0%)' : 'translateY(-100%)',
        })
        setStyleBelowItems({
            transition: 'all 0.3s ease-in-out',
            marginTop: showStudentDropDown ? '0px' : '-340px'
        })
    }, [showStudentDropDown])


    // check screen size
    useLayoutEffect(() => {
        const checkScreenSize = () => {
            if (window.innerWidth < 1130) {
                localStorage.setItem('isSmall', 'true')
                dispatch(resizeAction(true))
            } else {
                localStorage.setItem('isSmall', 'false')
                dispatch(resizeAction(false))
            }
        };

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, [])

    // change side bar style
    useLayoutEffect(() => {
        setStyle((prev) => {
            return {
                ...prev,
                transform: isSmall ? 'translateX(-100%)' : 'translateX(0%)',
                opacity: 1,
                transition: 'all 0.3s ease-in-out',
            }
        })
    }, [isSmall]);

    // show side bar 
    useLayoutEffect(() => {
        setStyle((prev) => {
            return {
                ...prev,
                transform: isSideBar ? 'translateX(0%)' : isSmall ? 'translateX(-100%)' : 'translateX(0%)',
                opacity: 1,
                transition: 'all 0.3s ease-in-out',
            }
        })
    }, [isSideBar])

    return (
        <div style={style} className='w-[300px] h-full fixed z-20 left-0 shadow-xl flex flex-col justify-between sidebar bg-white'>
            <div className='overflow-auto overflow-x-hidden relative h-full'>
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
            <div className='flex p-5 bg-gray-100'>
                <img className='w-8' src={user} alt="" />
                <div className='ml-5'>
                    <p style={{ fontSize: '15.5px' }} className='font-bold'>Vidhul</p>
                    <p style={{ fontSize: '15.5px' }} className='font-bold'>Counsellor</p>
                </div>
            </div>
        </div>
    )
}

export default SideBar
