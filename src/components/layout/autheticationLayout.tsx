import FloatingBackground from '../animation/floatingBackground'
import { Outlet } from 'react-router-dom'

function AuthenticationLayout() {
  return (
    <FloatingBackground>
        <Outlet/>
    </FloatingBackground>
  )
}

export default AuthenticationLayout
