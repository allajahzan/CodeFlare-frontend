import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { shrinkSideBarStudentAction, sideBarStudentAction, stateType } from "../../../redux/store"
import menu from '../../../assets/menu.svg'
import light from '../../../assets/light.svg'
import dark from '../../../assets/dark.svg'

function ContentHeadingInSmallSize() {

    const [icon, setIcon] = useState<string>('light')
    const isSideBarStudent = useSelector((state: stateType) => state.isSideBarStudent)
    const isSmall = useSelector((state: stateType) => state.isSmall)
    const dispatch = useDispatch()

    const handleSideBar = () => {
        dispatch(shrinkSideBarStudentAction(false))
        localStorage.setItem('isSideBarStudentShriked', `${false}`)
        dispatch(sideBarStudentAction(!isSideBarStudent))
    }

    const handleTheme = () => {
        icon === 'light' ? setIcon('dark') : setIcon('light')
    }

    return (
        <>
            {isSmall && <div className='w-full flex items-center justify-between'>
                <h1 className='text-2xl'>LOGO</h1>
                <div className='flex gap-x-2 items-center justify-center'>
                    <div onClick={handleSideBar} className='p-2 sm:p-2 cursor-pointer rounded-lg bg-white'><img className='w-7' src={menu} alt="" /></div>
                    <div onClick={handleTheme} className='p-2 sm:p-2 cursor-pointer rounded-lg bg-white'><img onClick={handleTheme} className='w-7' src={icon === 'light' ? light : dark} alt="" /></div>
                </div>
            </div>}
        </>
    )
}

export default ContentHeadingInSmallSize
