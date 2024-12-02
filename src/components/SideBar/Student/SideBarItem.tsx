import { useSelector } from 'react-redux'
import { stateType } from '../../../redux/store'
interface propTypes {
    image: string
    text: string,
    handleSideBarItems?: (event: React.MouseEvent<HTMLLIElement>) => void,
    color?: string,
}

function SideBarItem({ image, text, handleSideBarItems, color }: propTypes) {

    const isShrinkSideBarStudent = useSelector((state: stateType) => state.isShrinkSideBarStudent)

    return (
        <li title={isShrinkSideBarStudent ? text : ''} onClick={handleSideBarItems} className={`${color === '' ? '' : color } hover:bg-gray-100 cursor-pointer`}>
            <div className={`flex items-center justify-between p-2`}>
                <div className='flex items-center'>
                    <img style={{ width: '28px' }} src={image} alt="" />
                    {!isShrinkSideBarStudent && <p className='ml-5 font-extrabold tracking-wide text-nowrap'>{text}</p>}
                </div>
            </div>
        </li>
    )
}

export default SideBarItem
