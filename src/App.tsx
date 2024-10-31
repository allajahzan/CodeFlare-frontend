import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/client/Dashboard/Dashboard'
import Reviews from './pages/client/Reviews/Reviews'
import LeetCode from './pages/client/Leetcode/Leetcode'
import Invoice from './pages/client/Invoice/Invoice'
import Manifest from './pages/client/Manifest/Manifest'
import Leave from './pages/client/Leave/Leave'
import Login from './pages/client/Login/Login'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/*' element={<UserRoutes />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
      </Routes>
    </Router>
  )
}

function UserRoutes() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to={'student/login'} />} />
        <Route path='*' element={<Navigate to={'student/login'} />} />
        <Route path='student/login' element={<Login />} />
        <Route path='student/dashboard' element={<Dashboard />} />
        <Route path='student/reviews' element={<Reviews />} />
        <Route path='student/leetcode' element={<LeetCode />} />
        <Route path='student/invoice' element={<Invoice />} />
        <Route path='student/manifest' element={<Manifest />} />
        <Route path='student/leaves' element={<Leave />} />
      </Routes>
    </>
  )
}

function AdminRoutes() {
  return (
    <>
      <Routes>
        <Route path='' element={<Navigate to={'/admin/login'} />} />
        <Route path='*' element={<Navigate to={'/admin/login'} />} />
        <Route path='login' element={<div><p className='text-black text-2xl'>Login</p></div>} />
      </Routes>
    </>
  )
}

export default App
