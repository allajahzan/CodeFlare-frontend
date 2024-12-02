import { useEffect } from 'react'
// import logo from '../../../assets/icons/logo.png'
import email from '../../../assets/icons/email.svg'
// import copyright from '../../../assets/icons/copyright.svg'

function Login() {

    useEffect(() => {

    }, [])

    return (
        <div id='allaj' key={1} className="h-screen w-full flex flex-col items-center justify-between">
            <div className='p-5'>
                {/* <img className='w-40' src={logo} alt="" /> */}
                <h1 className='text-2xl'>BootCamp</h1>
            </div>
            <div className='flex flex-col 2 items-center justify-center space-y-6 relative -top-10 w-full px-5'>
                <p className='font-extrabold tracking-wider text-lg uppercase'>Student login</p>
                <form action="" className='w-full sm:w-[400px] relative flex flex-col space-y-4 transition-all duration-300 ease-in-out'>
                    <div className='flex relative items-center'>
                        <img className='absolute left-3 top-2.5 w-7' src={email} alt="" />
                        <input type="text" placeholder='Email ID' className='font-medium p-3 pl-14 px-4 w-full rounded-lg border-2 border-black border-opacity-10 outline-none' />
                    </div>
                    <button className='w-full p-3 px-8 rounded-md bg-black text-white shadow-lg font-extrabold tracking-wider uppercase'>Login</button>
                </form>
            </div>
            <div className=' p-2 pb-5 sm:p-5 flex items-center'>
                {/* <img className='w-4 sm:w-6 relative top-0.5' src={copyright} alt="" /> */}
                <p className='font-extrabold tracking-wide text-base text-center'>Bootcamp Management System | 2024</p>
            </div>
        </div>
    )
}

export default Login
