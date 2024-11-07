// import logo from '../../assets/logo.png'
import light from '../../assets/light.svg'
import dark from '../../assets/dark.svg'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { sideBarAction, stateType } from '../../redux/store'
import menu from '../../assets/menu.svg'


function Navbar() {

    const [icon, setIcon] = useState<string>('light')

    const handleTheme = () => {
        icon === 'light' ? setIcon('dark') : setIcon('light')
    }

    const dispath = useDispatch()
    const sideBar = useSelector((state: stateType) => state.isSideBar)
    const handleSideBar = () => {
        dispath(sideBarAction(!sideBar))
    }

    const isSmall = useSelector((state: stateType) => state.isSmall)

    return (
        <div className={`w-full p-5 fixed z-50 shadow-lg flex justify-between items-center bg-white`}>
            {isSmall && <img onClick={handleSideBar} className='w-10 cursor-pointer' src={menu} alt="" />}
            {/* <img className='w-40' src={logo} alt="" /> */}
            <h1 className='text-4xl'>LOGO</h1>
            <img onClick={handleTheme} className='w-7 cursor-pointer' src={icon === 'light' ? light : dark} alt="" />
        </div>
    )
}

export default Navbar