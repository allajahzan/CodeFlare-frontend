import Cell from "../Cell"

function Header() {
  return (
    <div className='flex justify-between items-center p-4 sticky top-0 z-10 border-2 rounded-t-lg rounded-lg border-black border-opacity-10 bg-black mb-2'>
      <div className='w-[500px] flex justify-start'><p style={{ color: 'white' }} className='font-medium'>{'No'}</p ></div>
      <div className='w-full flex justify-start'><p style={{ color: 'white' }} className='w-[180px] font-medium'>{'Discription'}</p ></div>
      <Cell text="Due Date" color="white" />
      <Cell text="Paid Date" color="white" />
      <Cell text="Amount" color="white" />
      <Cell text="Status" color="white" />
      <Cell text="Verify" color="white" />
    </div>
  )
}

export default Header
