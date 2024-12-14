interface propType {
    text: string,
}

function ContentHeading({ text }: propType) {
    return (
        <div className='flex items-center'>
            <p className='text-xl font-bold text-zinc-900'>{text}</p>
        </div>
    )
}

export default ContentHeading
