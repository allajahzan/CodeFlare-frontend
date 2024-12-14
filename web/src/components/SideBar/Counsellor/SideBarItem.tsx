import arrowUp from '../../../assets/icons/arrowUp.svg'
import arrowDown from '../../../assets/icons/arrowDown.svg'
import { useSelector } from 'react-redux'
import { stateType } from '../../../redux/store'
interface propTypes {
    image: string
    text: string,
    handleSideBarItems?: (event: React.MouseEvent<HTMLLIElement>) => void,
    color?: string,
    showStudentDropDown?: boolean
}

function SideBarItem({ image, text, handleSideBarItems, color, showStudentDropDown }: propTypes) {

    const isShrinkSideBarCounsellor = useSelector((state: stateType) => state.isShrinkSideBarCounsellor)

    return (
        <li title={isShrinkSideBarCounsellor ? text : ''} onClick={handleSideBarItems} className={`${color === '' ? '' : color} ${text==='Students'? '' : 'hover:bg-gray-100'} cursor-pointer`}>
            <div className={`flex items-center justify-between p-2 rounded-lg`}>
                <div className='flex items-center'>
                    <img style={{width : "28px"}} src={image} alt="" />
                    {!isShrinkSideBarCounsellor && <p  className='ml-5 font-extrabold tracking-wide text-nowrap'>{text}</p>}
                </div>
                {text === 'Students' && !isShrinkSideBarCounsellor && <img className='w-5' src={showStudentDropDown ? arrowUp : arrowDown} alt="" />}
            </div>
        </li>
    )
}

export default SideBarItem
