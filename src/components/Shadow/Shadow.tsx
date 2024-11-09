import { useSelector } from "react-redux"
import { stateType } from "../../redux/store"

function Shadow() {

    const isSideBar = useSelector((state: stateType) => state.isSideBar)
    const isSmall = useSelector((state: stateType) => state.isSmall)

    return (
        <>
            {isSideBar && isSmall && <div className='bg-black opacity-10 absolute z-30 top-0 left-0 h-screen w-screen'></div>}
        </>
    )
}

export default Shadow
