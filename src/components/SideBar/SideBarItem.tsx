import arrowUp from '../../assets/arrowUp.svg'
import arrowDown from '../../assets/arrowDown.svg'
interface propTypes {
    image: string
    text: string,
    handleSideBarItems?: (event: React.MouseEvent<HTMLParagraphElement>) => void,
    color?: string,
    showStudentDropDown?: boolean
}

function SideBarItem({ image, text, handleSideBarItems, color, showStudentDropDown }: propTypes) {
    return (
        <li>
            <div onClick={handleSideBarItems} className={`flex items-center space-x-28 ${color === '' ? 'bg-white' : color} hover:bg-gray-100 p-2 rounded-lg cursor-pointer`}>
                <div className='flex items-center'>
                    <img className='w-8' src={image} alt="" />
                    <p style={{ fontSize: '15.5px' }} className='ml-5 font-bold tracking-wide'>{text}</p>
                </div>
                {text === 'Students' && <img className='w-5' src={showStudentDropDown ? arrowUp : arrowDown} alt="" />}
            </div>
        </li>
    )
}

export default SideBarItem
