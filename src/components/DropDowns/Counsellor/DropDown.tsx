import downArrow from '../../../assets/icons/arrowDown.svg'
import upArrow from '../../../assets/icons/arrowUp.svg'

interface propType {
    stateVariable: boolean,
    setStateVariable1: React.Dispatch<React.SetStateAction<boolean>>,
    setStateVariable2?: React.Dispatch<React.SetStateAction<boolean>>,
    setStateVariable3?: React.Dispatch<React.SetStateAction<boolean>>,
    selectedItem: string,
    handleFunction: (item: string) => void,
    datas: string[] | null
}

function DropDown({ selectedItem, stateVariable, setStateVariable1, setStateVariable2, setStateVariable3, handleFunction, datas }: propType) {
    return (
        <div className="relative">
            <div onClick={() => { setStateVariable1(!stateVariable); setStateVariable2?.(false); setStateVariable3?.(false) }} className="p-3 bg-white flex items-center justify-between bg-transparent border-2 border-black border-opacity-10 font-medium rounded-lg cursor-pointer">
                <p style={{ fontSize: '14.5px' }}>{selectedItem}</p>
                <img className="w-6" src={stateVariable ? upArrow : downArrow} alt="" />
            </div>

            {stateVariable && (
                <div className={`absolute z-50 left-0 right-0 ${(datas as string[]).length > 5 ? 'h-[276px]' : ''} overflow-y-auto mt-1.5 bg-white border border-gray-200 rounded-lg shadow-lg`}>
                    {datas?.map((item, index) => (
                        <div key={index} onClick={() => handleFunction(item)} className="p-3 hover:bg-gray-100 cursor-pointer">
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DropDown
