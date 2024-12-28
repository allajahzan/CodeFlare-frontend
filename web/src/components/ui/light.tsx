interface PropsType{
    color: string
}

function LightEffect({color}:PropsType) {
  return (
    <span className={`absolute -translate-x-full inset-0 bg-gradient-to-r from-transparent ${color} to-transparent group-hover:animate-light`}></span>
  )
}

export default LightEffect
