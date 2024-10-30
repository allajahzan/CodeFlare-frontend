import Navbar from '../../../components/Navbar/Navbar'
import SideBar from '../../../components/SideBar/SideBar'
import manifest from '../../../assets/manifest.svg'
import TextField from '../../../components/TextField/TextField'
import { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { stateType } from '../../../redux/store';

function Manifest() {

    const [style, setStyle] = useState<React.CSSProperties>({
        padding: '20px',
        paddingLeft: '320px',
        paddingTop: '140px',
        transition: 'all 0.3s ease-in-out',
    });

    const isSmall = useSelector((state: stateType) => state.isSmall);

    useLayoutEffect(() => {
        setStyle(prevStyle => ({
            ...prevStyle,
            paddingLeft: isSmall ? '20px' : '320px'
        }));
    }, [isSmall]);

    return (
        <div>
            <Navbar />
            <div className='flex h-[100vh]'>
                <SideBar />
                <div style={style} className='w-full'>
                    <div className='flex items-start fixed top-24 '>
                        <img className='w-8' src={manifest} alt="" />
                        <p className='text-black font-bold text-lg tracking-wider ml-3 uppercase underline underline-offset-4'>Manifest</p>
                    </div>
                    <div className='flex flex-col h-full'>
                        <div className='sticky top-0 z-10 bg-white w-full flex justify-center pb-1'>
                            <div className='h-[110px] w-[110px] overflow-hidden rounded-full'>
                                <img className='w-full h-full object-cover' src={manifest} alt="" />
                            </div>
                        </div>

                        <div className='h-auto overflow-x-auto'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 w-full'>
                                <TextField label='Full Name' text='Ahsan allaj pk' />
                                <TextField label='Gender' text='Male' />
                                <TextField label='Email Address' text='ahsanallajpk@gmail.com' />
                                <TextField label='Mobile Number' text='7034661353' />
                                <div className='m-2 col-span-1 sm:col-span-2 relative'>
                                    <textarea readOnly id='address' className='resize-none grid-cols-1 w-full p-4 bg-transparent border-2 border-black border-opacity-20 rounded-lg outline-none' rows={2} value={'Padinjare Kottayil(H), Chalipparamb, Chelembra PO'} autoComplete='off'></textarea>
                                    <label htmlFor={'address'} className='absolute -top-3 left-3 bg-white p-1 px-2 font-medium text-xs text-gray-500'>Address</label>
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
