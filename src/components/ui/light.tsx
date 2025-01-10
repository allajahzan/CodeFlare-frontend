interface PropsType{
    color: string
    animation: string
}

function LightEffect({color, animation}:PropsType) {
  return (
    <span className={`absolute -translate-x-full inset-0 bg-gradient-to-r from-transparent ${color} to-transparent ${animation}`}></span>
  )
}

export default LightEffect
