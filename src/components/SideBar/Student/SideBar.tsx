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
import SideBarItem from '../SideBarItem'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLayoutEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { stateType, resizeAction, sideBarAction, shrinkAction } from '../../../redux/store'
import './SideBar.css'


function SideBar() {

    const [style, setStyle] = useState<React.CSSProperties>({})
    const isSmall = useSelector((state: stateType) => state.isSmall)
    const isSideBar = useSelector((state: stateType) => state.isSideBar)
    const isShrink = useSelector((state: stateType) => state.isShrink)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const item = (useLocation().pathname)

    const handleShrink = () => {
        dispatch(shrinkAction(!isShrink))
        localStorage.setItem("isSideBarShriked", `${!isShrink}`)
    }

    const handleSideBar = () => {
        dispatch(shrinkAction(!isShrink))
        localStorage.setItem('isSideBarShriked', `${!isShrink}`)
        dispatch(sideBarAction(!isSideBar))
    }

    const handleSideBarItems = (event: React.MouseEvent<HTMLLIElement>) => {
        const text = !isShrink ? (event.currentTarget.querySelector('p') as HTMLParagraphElement)?.innerHTML.toLowerCase()
            : event.currentTarget.title.toLowerCase()

        if (text) {
            navigate(`/student/${text}`);
        }

        if (isSmall) {
            dispatch(sideBarAction(!isSideBar));
        }
    }

    useLayoutEffect(() => {
        const checkScreenSize = () => {
            if (window.innerWidth < 899) {
                dispatch(resizeAction(true))
            } else {
                dispatch(resizeAction(false))
                dispatch(sideBarAction(false))
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
                width: isShrink ? '68px' : '250px'
            }
        })
    }, [isShrink])

    useLayoutEffect(() => {
        setStyle((prev) => {
            return {
                ...prev,
                width: isShrink ? '68px' : '250px',
                transform: isSmall ? 'translateX(-100%)' : 'translateX(0%)',
                opacity: 1,
                transition: 'all 0.3s ease-in-out',
            }
        })
    }, [isSmall, isShrink]);

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
        <div style={style} className={`h-full fixed top-0 left-0 flex flex-col justify-between ${isSmall ? 'bg-white shadow-xl z-30' : 'bg-white z-20'}`}>
            <div style={{ paddingTop: '72px' }} className='overflow-auto overflow-x-hidden relative'>
                <div className='p-5 pr-4 flex fixed top-0 w-full items-center justify-between border-b-2 border-opacity-5 border-black'>
                    {/* <img className='w-32' src={logo} alt="" /> */}
                    {!isShrink && <h1 className='text-2xl overflow-hidden'>LOGO</h1>}
                    <img onClick={isSideBar && isSmall ? handleSideBar : handleShrink} className='w-8 cursor-pointer' src={isSideBar && isSmall ? close : menu} alt="" />
                </div>
                <SideBarItem color={item === '/student/dashboard' ? 'bg-gray-100' : ''} image={dashboard} text='Dashboard' handleSideBarItems={handleSideBarItems} />
                <SideBarItem color={item === '/student/reviews' ? 'bg-gray-100' : ''} image={review} text='Reviews' handleSideBarItems={handleSideBarItems} />
                <SideBarItem color={item === '' ? 'bg-gray-100' : ''} image={task} text='Tasks' handleSideBarItems={handleSideBarItems} />
                <SideBarItem color={item === '/student/leetcode' ? 'bg-gray-100' : ''} image={leetcode} text='Leetcode' handleSideBarItems={handleSideBarItems} />
                <SideBarItem color={item === '/student/leaves' ? 'bg-gray-100' : ''} image={leave} text='Leaves' handleSideBarItems={handleSideBarItems} />
                <SideBarItem color={item === '/student/invoice' ? 'bg-gray-100' : ''} image={invoice} text='Invoice' handleSideBarItems={handleSideBarItems} />
                <SideBarItem color={item === '/student/manifest' ? 'bg-gray-100' : ''} image={manifest} text='Manifest' handleSideBarItems={handleSideBarItems} />
                <SideBarItem color={item === '' ? 'bg-gray-100' : ''} image={logout} text='Logout' />
            </div>
            <div title={isShrink ? `Ahsan allaj pk MERNStack` : ''} style={isShrink ? { padding: '17.4px 18px' } : { padding: '10px 18px' }} className='flex items-center bg-gray-100 overflow-hidden'>
                <img className='w-8' src={user} alt="" />
                <div className='ml-5 flex flex-col gap-1 text-nowrap'>
                    {!isShrink && <p style={{ fontSize: '15.2px' }} className='font-extrabold'>Ahsan allaj pk</p>}
                    {!isShrink && <p style={{ fontSize: '13.2px' }} className='font-extrabold'>MERN Stack</p>}
                </div>
            </div>
        </div>
    )
}

export default SideBar
