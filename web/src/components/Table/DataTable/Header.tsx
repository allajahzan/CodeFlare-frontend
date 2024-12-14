function Header() {
  return (
    <div className='flex justify-between items-center p-4 sticky top-0 z-10 border-2 rounded-lg border-black border-opacity-10 bg-black mb-2'>
      <div className='w-[500px] flex justify-start'><p style={{ color: 'white' }} className='font-medium'>{'No'}</p ></div>
      <div className='w-full flex justify-start'><p style={{ color: 'white' }} className='w-[180px] font-medium'>{'Coordinator'}</p ></div>
      <div className='w-full flex justify-center'><p className='text-white'>Week</p ></div>
      <div className='w-full flex justify-center'><p className='text-white'>Date</p ></div>
      <div className='w-full flex justify-center'><p className='text-white'>Status</p ></div>
      <div className='w-full flex justify-center'><p className='text-white'>Pendings</p ></div>
      <div className='w-full flex justify-center'><p className='text-white'>Rate</p ></div>
    </div>
  )
}

export default Header
