import FloatingBackground from '@/components/animation/floating-background'
import { Outlet } from 'react-router-dom'

// Authentication Layout Component
function AuthenticationLayout() {
  return (
    <FloatingBackground>
        <Outlet/>
    </FloatingBackground>
  )
}

export default AuthenticationLayout
