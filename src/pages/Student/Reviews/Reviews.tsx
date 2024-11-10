import SideBar from '../../../components/SideBar/Student/SideBar'
import DataTable from '../../../components/Table/DataTable/DataTable'
import review from '../../../assets/review.svg'
import { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { stateType } from '../../../redux/store';
import ContentHeadingInSmallSize from '../../../components/Headings/Student/ContentHeadingInSmallSize';
import Shadow from '../../../components/Shadow/Shadow';
import ContentHeading from '../../../components/Headings/ContentHeading';

function Reviews() {

  const [style, setStyle] = useState<React.CSSProperties>({ transition: 'all 0.3s ease-in-out' });
  const isSmall = useSelector((state: stateType) => state.isSmall);
  const isShrinkSideBarStudent = useSelector((state: stateType) => state.isShrinkSideBarStudent)

  useLayoutEffect(() => {
    setStyle(prevStyle => ({
      ...prevStyle,
      paddingTop: isShrinkSideBarStudent ? isSmall ? '0px' : '0px' : isSmall ? '0px' : '20px',
      paddingLeft: isShrinkSideBarStudent ? isSmall ? '0px' : '68px' : isSmall ? '0px' : '250px'
    }));
  }, [isShrinkSideBarStudent, isSmall])

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
              <ContentHeading image={review} text='Review' />
            </div>

            <DataTable />

          </div>
        </div>
      </div>

    </div>
  )
}

export default Reviews
