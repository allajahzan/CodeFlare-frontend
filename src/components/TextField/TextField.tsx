function TextField({ text, label }: { text: string, label: string }) {
    return (
        <div className='flex flex-col relative m-2'>
            <input id={label} className='p-4 bg-transparent border-2 border-black border-opacity-20 rounded-lg outline-none' type="text" value={text} readOnly autoComplete="off" />
            <label htmlFor={label} className='absolute -top-3 left-3 bg-white p-1 px-2 font-medium text-xs text-gray-500'>{label}</label>
        </div>
    )
}

export default TextField
