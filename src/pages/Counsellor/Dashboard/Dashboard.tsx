import Navbar from "../../../components/Navbar/Navbar"
import SideBar from "../../../components/SideBar/Counsellor/SideBar"
import dashboard from '../../../assets/dashboard.svg'
import { useSelector } from "react-redux";
import { useLayoutEffect, useState } from "react";
import { stateType } from "../../../redux/store";
import CountCard from "../../../components/Cards/Counseller/CountCard"

function Dashboard() {

  const [style, setStyle] = useState<React.CSSProperties>({
    padding: '20px',
    paddingLeft: '320px',
    paddingTop: '96px',
    transition: 'all 0.3s ease-in-out',
  });

  const isSmall = useSelector((state: stateType) => state.isSmall);

  useLayoutEffect(() => {
    setStyle(prevStyle => ({
      ...prevStyle,
      paddingLeft: isSmall ? '20px' : '320px',
    }));
  }, [isSmall]);

  return (
    <div>
      <Navbar />
      <SideBar />
      <div style={style} className='w-full flex flex-col gap-y-4'>
        <div className='flex justify-between'>
          <div className='flex items-start'>
            <img className='w-8' src={dashboard} alt="" />
            <p className='text-black font-bold text-lg tracking-wider ml-3 uppercase underline underline-offset-4'>Dashboard</p>
          </div>
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
  )
}

export default Dashboard
