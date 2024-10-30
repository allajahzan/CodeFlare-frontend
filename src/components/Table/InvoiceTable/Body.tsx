import Cell from '../Cell'

function Body({ index }: { index: number }) {

    const color = index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'

    return (
        <div className={`flex justify-between items-center p-4 rounded-lg ${color}`}>
            <div className='w-[800px] flex justify-start'><p style={{ color: color }} className='font-medium'>{index}</p ></div>
            <div className='w-full flex justify-start'><p style={{ color: color }} className='w-[180px] font-medium text-ellipsis overflow-hidden whitespace-nowrap'>{'Calicut Monthly Rent 2024'}</p ></div>
            <Cell text={'03-10-2024'} color='black' />
            <Cell text={'12-10-2024'} color='black' />
            <Cell text={'4000'} color='black' />
            <div className='w-full flex justify-center'><p style={{ backgroundColor: 'green', color: 'white' }} className='font-medium p-1 py-1 px-5 rounded-md'>{'Paid'}</p ></div>
            <div className='w-full flex justify-center'><p className='font-medium p-1 py-1 px-5 rounded-md bg-blue-500 text-white'>{'Verified'}</p ></div>
        </div>
    )
}

export default Body
