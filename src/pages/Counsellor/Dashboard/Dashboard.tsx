import SideBar from "../../../components/SideBar/Counsellor/SideBar"
import dashboard from '../../../assets/dashboard.svg'
import { useSelector } from "react-redux";
import { useLayoutEffect, useState } from "react";
import { stateType } from "../../../redux/store";
import CountCard from "../../../components/Cards/Counseller/CountCard"
import Shadow from "../../../components/Shadow/Shadow";
import ContentHeadingInSmallSize from "../../../components/Headings/Counsellor/ContentHeadingInSmallSize";
import ContentHeading from "../../../components/Headings/ContentHeading";

function Dashboard() {

  const [style, setStyle] = useState<React.CSSProperties>({ transition: 'all 0.3s ease-in-out', });
  const isShrinkSideBarCounsellor = useSelector((state: stateType) => state.isShrinkSideBarCounsellor)
  const isSmall = useSelector((state: stateType) => state.isSmall);

  useLayoutEffect(() => {
    setStyle(prevStyle => ({
      ...prevStyle,
      paddingTop: isShrinkSideBarCounsellor ? isSmall ? '0px' : '0px' : isSmall ? '0px' : '20px',
      paddingLeft: isShrinkSideBarCounsellor ? isSmall ? '0px' : '68px' : isSmall ? '0px' : '250px'
    }));
  }, [isShrinkSideBarCounsellor, isSmall])

  return (
    <div>
      <Shadow />
      <div className='flex h-[100vh]'>
        <SideBar />
        <div style={style} className='w-full'>
          <div style={{ borderWidth: isSmall ? '0px' : '6px 0px 0px 6px', boxShadow: '0.01rem 0.05rem 1rem 0.2rem #eeeeee', backgroundColor: '#f5f5f5', padding: '20px', paddingTop: isSmall ? '14px' : '20px' }}
            className='w-full h-full flex flex-col gap-y-4 border-white rounded-tl-lg  relative z-20'>

            <ContentHeadingInSmallSize />

            <div className='flex justify-between items-start relative'>
              <ContentHeading image={dashboard} text='Dashboard' />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <CountCard count={120} text="Total Students" />
              <CountCard count={120} text="Held Students" />
              <CountCard count={120} text="Students In Quality" />
              <CountCard count={120} text="Completed Students" />
              <CountCard count={120} text="Placed Students" />
              <CountCard count={120} text="Quit Students" />
              <CountCard count={120} text="Terminated Students" />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
