function TextField({ text, label }: { text: string, label: string }) {
    return (
        <div className='flex flex-col relative'>
            <input id={label} className='p-4 bg-transparent border-2 border-black border-opacity-10 rounded-lg outline-none' type="text" value={text} readOnly autoComplete="off" />
            <label style={{ backgroundColor: '#f5f5f5' }} htmlFor={label} className='absolute -top-2.5 left-3 p-1 px-2 font-extrabold text-xs text-gray-500'>{label}</label>
        </div>
    )
}

export default TextField
