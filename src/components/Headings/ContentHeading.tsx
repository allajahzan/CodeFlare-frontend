interface propType {
    text: string,
    image: string
}

function ContentHeading({ text, image }: propType) {
    return (
        <div className='flex items-center'>
            {/* <img style={{width:'32px'}} src={image} alt="" /> */}
            <p className='text-black font-bold text-lg tracking-wider underline-offset-4'>{text}</p>
        </div>
    )
}

export default ContentHeading
