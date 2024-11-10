import SideBar from '../../../components/SideBar/Student/SideBar'
import dashboard from '../../../assets/dashboard.svg'
import { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { stateType } from '../../../redux/store';
import Shadow from '../../../components/Shadow/Shadow';
import ContentHeadingInSmallSize from '../../../components/Headings/Student/ContentHeadingInSmallSize';
import ContentHeading from '../../../components/Headings/ContentHeading';

function Dashboard() {

  const [style, setStyle] = useState<React.CSSProperties>({ transition: 'all 0.3s ease-in-out' });
  const isShrinkSideBarStudent = useSelector((state: stateType) => state.isShrinkSideBarStudent)
  const isSmall = useSelector((state: stateType) => state.isSmall);

  useLayoutEffect(() => {
    setStyle(prevStyle => ({
      ...prevStyle,
      paddingTop: isShrinkSideBarStudent ? isSmall ? '70px' : '0px' : isSmall ? '70px' : '20px',
      paddingLeft: isShrinkSideBarStudent ? isSmall ? '20px' : '68px' : isSmall ? '20px' : '250px'
    }));
  }, [isShrinkSideBarStudent, isSmall])

  return (
    <div>
      <Shadow />
      <div className='flex h-[100vh]'>
        <SideBar />
        <div style={style} className='w-full bg-white'>

          <ContentHeadingInSmallSize />

          <div style={{ borderWidth: isSmall ? '6px 0px 0px 6px' : '6px 0px 0px 6px', boxShadow: '0.01rem 0.05rem 1rem 0.2rem #eeeeee', backgroundColor: '#f5f5f5', padding: '20px'}}
            className='w-full h-full flex flex-col gap-y-4 border-white rounded-tl-lg  relative z-20'>

            <div className='flex justify-between items-start relative'>
              <ContentHeading image={dashboard} text='Dashboard' />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
