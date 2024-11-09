interface propType {
    text: string,
    image: string
}

function ContentHeading({ text, image }: propType) {
    return (
        <div className='flex items-center'>
            <img className='w-8' src={image} alt="" />
            <p className='text-black font-bold text-lg tracking-wider ml-3 uppercase underline underline-offset-4'>{text}</p>
        </div>
    )
}

export default ContentHeading
