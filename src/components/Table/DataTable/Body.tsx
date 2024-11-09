function Body({ index }: { index: number }) {

    const color = index % 2 === 0 ? 'bg-white' : 'bg-white'

    return (
        <div className={`flex justify-between items-center p-4 rounded-lg ${color}`}>
            <div className='w-[500px] flex justify-start'><p style={{ color: color }} className=''>{index}</p ></div>
            <div className='w-full flex justify-start'><p style={{ color: color }} className='w-[180px]  text-ellipsis overflow-hidden whitespace-nowrap'>{'Muhammed Sharik asdfadsf'}</p ></div>
            <div className='w-full flex justify-center'><p style={{ color: color }} className=''>{'ss'}</p ></div>
            <div className='w-full flex justify-center'><p style={{ color: color }} className=''>{'ss'}</p ></div>
            <div className='w-full flex justify-center'><p style={{ color: 'white', backgroundColor: 'green' }} className='p-1 py-1 px-5 rounded-md '>{'Passed'}</p ></div>
            <div className='w-full flex justify-center'><p style={{ color: color }} className=''>{'ssss'}</p ></div>
            <div className='w-full flex justify-center'><p style={{ color: color }} className=''>{'ssss'}</p ></div>
        </div>
    )
}

export default Body
