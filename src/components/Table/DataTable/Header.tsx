import Cell from "../Cell"

function Header() {
  return (
    <div className='flex justify-between items-center p-4 sticky top-0 z-10 border-2 rounded-lg border-black border-opacity-10 bg-black mb-2'>
      <div className='w-[800px] flex justify-start'><p style={{ color: 'white' }} className='font-medium'>{'No'}</p ></div>
      <div className='w-full flex justify-start'><p style={{ color: 'white' }} className='w-[180px] font-medium'>{'Coordinator'}</p ></div>
      <Cell text="Week" color="white" />
      <Cell text="Date" color="white" />
      <Cell text="Status" color="white" />
      <Cell text="Pendings" color="white" />
      <Cell text="Rate" color="white" />
    </div>
  )
}

export default Header
