import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { shrinkAction, sideBarAction, stateType } from "../../redux/store"
import menu from '../../assets/menu.svg'
import light from '../../assets/light.svg'
import dark from '../../assets/dark.svg'

function ContentHeadingInSmallSize() {

    const [icon, setIcon] = useState<string>('light')
    const isSideBar = useSelector((state: stateType) => state.isSideBar)
    const isSmall = useSelector((state: stateType) => state.isSmall)
    const dispatch = useDispatch()

    const handleSideBar = () => {
        dispatch(shrinkAction(false))
        localStorage.setItem('isSideBarShriked', `${false}`)
        dispatch(sideBarAction(!isSideBar))
    }

    const handleTheme = () => {
        icon === 'light' ? setIcon('dark') : setIcon('light')
    }

    return (
        <>
            {isSmall && <div className='w-full flex items-center justify-between'>
                <h1 className='text-2xl'>LOGO</h1>
                <div className='flex gap-x-2 items-center justify-center'>
                    <div onClick={handleSideBar} className='p-1 sm:p-2 cursor-pointer rounded-lg bg-white'><img className='w-6 sm:w-7' src={menu} alt="" /></div>
                    <div onClick={handleTheme} className='p-1 sm:p-2 cursor-pointer rounded-lg bg-white'><img onClick={handleTheme} className='w-6 sm:w-7' src={icon === 'light' ? light : dark} alt="" /></div>
                </div>
            </div>}
        </>
    )
}

export default ContentHeadingInSmallSize
