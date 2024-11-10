import dashboard from '../../../assets/dashboard.svg'
import leave from '../../../assets/leave.svg'
import review from '../../../assets/review.svg'
import task from '../../../assets/task.svg'
import manifest from '../../../assets/manifest.svg'
import logout from '../../../assets/logout.svg'
import invoice from '../../../assets/invoice.svg'
import leetcode from '../../../assets/leetcode.svg'
import user from '../../../assets/user.svg'
import menu from '../../../assets/menu.svg'
import close from '../../../assets/close.svg'
import SideBarItem from '../Student/SideBarItem'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLayoutEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { stateType, resizeAction, sideBarStudentAction, shrinkSideBarStudentAction } from '../../../redux/store'
import './SideBar.css'


function SideBar() {

    const [style, setStyle] = useState<React.CSSProperties>({})
    const isSmall = useSelector((state: stateType) => state.isSmall)
    const isSideBarStudent = useSelector((state: stateType) => state.isSideBarStudent)
    const isShrinkSideBarStudent = useSelector((state: stateType) => state.isShrinkSideBarStudent)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const item = (useLocation().pathname)

    const handleShrink = () => {
        dispatch(shrinkSideBarStudentAction(!isShrinkSideBarStudent))
        localStorage.setItem("isSideBarStudentShriked", `${!isShrinkSideBarStudent}`)
    }

    const handleSideBar = () => {
        dispatch(shrinkSideBarStudentAction(!isShrinkSideBarStudent))
        localStorage.setItem('isSideBarStudentShriked', `${!isShrinkSideBarStudent}`)
        dispatch(sideBarStudentAction(!isSideBarStudent))
    }

    const handleSideBarItems = (event: React.MouseEvent<HTMLLIElement>) => {
        const text = !isShrinkSideBarStudent ? (event.currentTarget.querySelector('p') as HTMLParagraphElement)?.innerHTML.toLowerCase()
            : event.currentTarget.title.toLowerCase()

        if (text) {
            navigate(`/student/${text}`);
        }

        if (isSmall) {
            dispatch(sideBarStudentAction(!isSideBarStudent));
        }
    }

    useLayoutEffect(() => {
        const checkScreenSize = () => {
            if (window.innerWidth < 899) {
                dispatch(resizeAction(true))
            } else {
                dispatch(resizeAction(false))
                dispatch(sideBarStudentAction(false))
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
                width: isShrinkSideBarStudent ? '68px' : '250px'
            }
        })
    }, [isShrinkSideBarStudent])

    useLayoutEffect(() => {
        setStyle((prev) => {
            return {
                ...prev,
                width: isShrinkSideBarStudent ? '68px' : '250px',
                transform: isSmall ? 'translateX(-100%)' : 'translateX(0%)',
                opacity: 1,
                transition: 'all 0.3s ease-in-out',
            }
        })
    }, [isSmall, isShrinkSideBarStudent]);

    useLayoutEffect(() => {
        setStyle((prev) => {
            return {
                ...prev,
                transform: isSideBarStudent ? 'translateX(0%)' : isSmall ? 'translateX(-100%)' : 'translateX(0%)',
                opacity: 1,
                transition: 'all 0.3s ease-in-out',
            }
        })
    }, [isSideBarStudent])

    return (
        <div style={style} className={`h-full fixed top-0 left-0 flex flex-col justify-between ${isSmall ? 'bg-white shadow-xl z-30' : 'bg-white z-20'}`}>
            <div className='p-5 pr-4 flex fixed z-50 bg-white top-0 w-full items-center justify-between shadow-sm'>
                {/* <img className='w-32' src={logo} alt="" /> */}
                {!isShrinkSideBarStudent && <h1 className='text-2xl overflow-hidden'>LOGO</h1>}
                <img onClick={isSideBarStudent && isSmall ? handleSideBar : handleShrink} className='w-8 cursor-pointer' src={isSideBarStudent && isSmall ? close : menu} alt="" />
            </div>
            <div style={{ marginTop: '72px' }} className='overflow-auto overflow-x-hidden relative'>

                <SideBarItem color={item === '/student/dashboard' ? 'bg-gray-100' : ''} image={dashboard} text='Dashboard' handleSideBarItems={handleSideBarItems} />
                <SideBarItem color={item === '/student/reviews' ? 'bg-gray-100' : ''} image={review} text='Reviews' handleSideBarItems={handleSideBarItems} />
                <SideBarItem color={item === '' ? 'bg-gray-100' : ''} image={task} text='Tasks' handleSideBarItems={handleSideBarItems} />
                <SideBarItem color={item === '/student/leetcode' ? 'bg-gray-100' : ''} image={leetcode} text='Leetcode' handleSideBarItems={handleSideBarItems} />
                <SideBarItem color={item === '/student/leaves' ? 'bg-gray-100' : ''} image={leave} text='Leaves' handleSideBarItems={handleSideBarItems} />
                <SideBarItem color={item === '/student/invoice' ? 'bg-gray-100' : ''} image={invoice} text='Invoice' handleSideBarItems={handleSideBarItems} />
                <SideBarItem color={item === '/student/manifest' ? 'bg-gray-100' : ''} image={manifest} text='Manifest' handleSideBarItems={handleSideBarItems} />
                <SideBarItem color={item === '' ? 'bg-gray-100' : ''} image={logout} text='Logout' />
            </div>
            <div title={isShrinkSideBarStudent ? `Ahsan allaj pk MERNStack` : ''} style={isShrinkSideBarStudent ? { padding: '25.3px 18px' } : { padding: '18px 18px' }} className='flex fixed z-50 bottom-0  w-full items-center bg-gray-100 overflow-hidden'>
                <img className='w-8' src={user} alt="" />
                <div className='ml-5 flex flex-col gap-1 text-nowrap'>
                    {!isShrinkSideBarStudent && <p style={{ fontSize: '15.2px' }} className='font-extrabold'>Ahsan allaj pk</p>}
                    {!isShrinkSideBarStudent && <p style={{ fontSize: '13.2px' }} className='font-extrabold'>MERN Stack</p>}
                </div>
            </div>
        </div>
    )
}

export default SideBar
