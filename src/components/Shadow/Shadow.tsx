import { useSelector } from "react-redux"
import { stateType } from "../../redux/store"

function Shadow() {

    const isSideBarStudent = useSelector((state: stateType) => state.isSideBarStudent)
    const isSideBarCounsellor = useSelector((state:stateType)=>state.isSideBarCounsellor)
    const isSmall = useSelector((state: stateType) => state.isSmall)

    return (
        <>
            {(isSideBarStudent || isSideBarCounsellor) && isSmall && <div className='bg-black bg-opacity-20 absolute z-30 top-0 left-0 h-screen w-screen'></div>}
        </>
    )
}

export default Shadow
