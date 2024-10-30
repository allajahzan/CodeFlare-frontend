import Cell from '../Cell'

function Body({ index }: { index: number }) {

    const color = index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'

    return (
        <div className={`flex justify-between items-center p-4 rounded-lg ${color}`}>
            <div className='w-[800px] flex justify-start'><p style={{ color: color }} className='font-medium'>{index}</p ></div>
            <div className='w-full flex justify-start'><p style={{ color: color }} className='w-[180px] font-medium text-ellipsis overflow-hidden whitespace-nowrap'>{'Muhammed Sharik asdfadsf'}</p ></div>
            <Cell text={'21'} color='black' />
            <Cell text={'12-10-2024'} color='black' />
            <div className='w-full flex justify-center'><p style={{ color: 'white', backgroundColor: 'green' }} className='p-1 py-1 px-5 rounded-md font-medium'>{'Passed'}</p ></div>
            <Cell text={'Pendings'} color='black' />
            <Cell text={'Ratings'} color='black' />
        </div>
    )
}

export default Body
