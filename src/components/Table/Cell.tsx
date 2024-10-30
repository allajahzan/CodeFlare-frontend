function Cell({text,color}:{text:string | number, color:string}) {
  return (
    <div className='w-full flex justify-center'><p style={{color:color}} className='font-medium'>{text}</p ></div>
  )
}

export default Cell
