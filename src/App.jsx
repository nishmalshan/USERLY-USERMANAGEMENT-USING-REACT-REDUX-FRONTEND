import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home'
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import UserProfile from './Components/Userprofile/UserProfile';
import AdminDashboardPage from './Pages/AdminDashboardPage';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import FetchUserInfo from './Components/FetchUserInfo';

function App() {

  const { user } = useSelector((state) => state.auth)
  const { users } = useSelector((state) => state.users)



  return (
    <>
    <Router>
      <FetchUserInfo/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={!user ? <Signup/> : user.role === 'admin' ? <Navigate to='/admin/dashboard'/> : <Navigate to='/'/>}/>
        <Route path='/login' element={!user ? <Login/> : user.role === 'admin' ? <Navigate to='/admin/dashboard'/> : <Navigate to='/'/>}/>
        <Route path='/profile' element={user?.role === 'user' ? <UserProfile/> :  <Navigate to='/'/>}/>
        <Route path='/admin/dashboard' element={ user?.role === 'admin' ? <AdminDashboardPage/> : <Navigate to='/'/>}/>
      </Routes>
    </Router>
    <Toaster position="top-center" reverseOrder={false} />;
    </>
  )
}

export default App
