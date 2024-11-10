import SideBar from '../../../components/SideBar/Student/SideBar'
import manifest from '../../../assets/manifest.svg'
import user from '../../../assets/allaj.jpeg'
import TextField from '../../../components/TextField/TextField'
import { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { stateType } from '../../../redux/store';
import Shadow from '../../../components/Shadow/Shadow';
import ContentHeading from '../../../components/Headings/ContentHeading';
import ContentHeadingInSmallSize from '../../../components/Headings/Student/ContentHeadingInSmallSize';

function Manifest() {

    const [style, setStyle] = useState<React.CSSProperties>({ transition: 'all 0.3s ease-in-out' });
    const isSmall = useSelector((state: stateType) => state.isSmall);
    const isShrinkSideBarStudent = useSelector((state: stateType) => state.isShrinkSideBarStudent)

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
                <div style={style} className='w-full'>

                    <ContentHeadingInSmallSize />

                    <div style={{ borderWidth:'6px 0px 0px 6px', boxShadow: '0.01rem 0.05rem 1rem 0.2rem #eeeeee', backgroundColor: '#f5f5f5', padding: '20px'}}
                        className='w-full h-full flex flex-col gap-y-4 border-white rounded-tl-lg  relative z-20'>

                        <div className='flex justify-between items-start relative'>
                            <ContentHeading image={manifest} text='Manifest' />
                        </div>

                        <div className='flex-grow h-auto overflow-x-auto rounded-lg'>
                            <div style={{ backgroundColor: '#f5f5f5' }} className='sticky top-0 z-10 bg-transparent w-full flex justify-center p-2 pt-3'>
                                <div className='h-[120px] w-[120px] overflow-hidden rounded-full shadow-lg'>
                                    <img className='w-full h-full object-cover' src={user} alt="" />
                                </div>
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full p-4'>
                                <TextField label='Full Name' text='Ahsan allaj pk' />
                                <TextField label='Gender' text='Male' />
                                <TextField label='Email Address' text='ahsanallajpk@gmail.com' />
                                <TextField label='Mobile Number' text='7034661353' />
                                <div className='col-span-1 sm:col-span-2 relative'>
                                    <textarea readOnly id='address' className='resize-none grid-cols-1 w-full p-4 bg-transparent border-2 border-black border-opacity-10 rounded-lg outline-none' rows={2} value={'Padinjare Kottayil(H), Chalipparamb, Chelembra PO'} autoComplete='off'></textarea>
                                    <label style={{ backgroundColor: '#f5f5f5' }} htmlFor={'address'} className='absolute -top-2.5 left-3 p-1 px-2 font-extrabold text-xs text-gray-500'>Address</label>
                                </div>
                                <TextField label='Pincode' text='673634' />
                                <TextField label='Place' text='Chelembra' />
                                <TextField label='District' text='Malappuram' />
                                <TextField label='State' text='Kerala' />
                                <TextField label='Fathers Name ' text='Abdul Razak pk' />
                                <TextField label='Mothers Name' text='Nafeesa Ak' />
                                <TextField label='Guardians Name' text='Abdul Razak' />
                                <TextField label='Guardians Phone Number' text='9846725214' />
                                <TextField label='Batch' text='BCK-188' />
                                <TextField label='Branch' text='Calicut' />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Manifest
