import arrowUp from '../../../assets/arrowUp.svg'
import arrowDown from '../../../assets/arrowDown.svg'
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

    const isShrinkSideBarStudent = useSelector((state:stateType)=>state.isShrinkSideBarStudent)

    return (
        <li title={isShrinkSideBarStudent? text : ''} onClick={handleSideBarItems} className={`${color === '' ? '' : color} hover:bg-gray-100 cursor-pointer`}>
            <div className={`flex items-center justify-between p-2 rounded-lg`}>
                <div className='flex items-center'>
                    <img style={{width:'32px'}} src={image} alt="" />
                    {!isShrinkSideBarStudent && <p style={{ fontSize: '15.2px' }} className='ml-5 font-extrabold tracking-wide text-nowrap'>{text}</p>}
                </div>
                {text === 'Students' && <img className='w-5' src={showStudentDropDown ? arrowUp : arrowDown} alt="" />}
            </div>
        </li>
    )
}

export default SideBarItem
