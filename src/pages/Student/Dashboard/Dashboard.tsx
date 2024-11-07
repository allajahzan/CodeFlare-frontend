import Navbar from '../../../components/Navbar/Navbar';
import SideBar from '../../../components/SideBar/Student/SideBar'
import dashboard from '../../../assets/dashboard.svg'
import { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { stateType } from '../../../redux/store';

function Dashboard() {

  const [style, setStyle] = useState<React.CSSProperties>({
    padding: '20px',
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
      <div className='flex h-[100vh]'>
        <SideBar />
        <div style={style} className='w-full flex flex-col gap-y-4'>
          <div className='flex items-start'>
            <img className='w-8' src={dashboard} alt="" />
            <p className='text-black font-bold text-lg tracking-wider ml-3 uppercase underline underline-offset-4'>Dashboard</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Dashboard
