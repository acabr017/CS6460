import {useState} from 'react'
import './App.css'
import {Routes, Route, useLocation} from 'react-router'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'

import Classes from './components/classes/Classes'
import CreateClass from  './components/classes/CreateClass'
import EditClass from './components/classes/EditClass'
import DeleteClass from  './components/classes/DeleteClass'

import CreateSchoolYear from  './components/school_year/CreateSchoolYear'
import EditSchoolYear from  './components/school_year/EditSchoolYear'
import DeleteSchoolYear from  './components/school_year/DeleteSchoolYear'

import NavBar from './components/navbar/navbar'

import ProtectedRoute from './components/ProtectedRoutes'

import PasswordResetRequest from './components/PasswordResetRequests'
import PasswordReset from './components/PasswordReset'

import Calendar1 from './components/Calendar1'

function App() {
  const location = useLocation()
  const noNavbar = location.pathname === "/register" || location.pathname === "/login" || location.pathname.includes("password")
  return (
    <> {/*what is the point of this?*/} 
    {
      noNavbar ?
      <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/request/password_reset' element={<PasswordResetRequest/>}/>
      <Route path='/password_reset/:token' element={<PasswordReset/>}/>
      
      </Routes>
      :
      <NavBar
      content={
        <Routes>
          <Route element={<ProtectedRoute/>}>
            <Route path='' element={<Home/>}/>
            <Route path='/classes' element={<Classes/>}/>{/* Wouldn't I want the school year to be top level, then classes under that? */} 
            <Route path='/create_school_year' element={<CreateSchoolYear/>}/>
            <Route path='/edit_school_year/:id' element={<EditSchoolYear/>}/>
            <Route path='/delete_school_year/:id' element={<DeleteSchoolYear/>}/>
            <Route path='/calendar1' element={<Calendar1/>}/>
          </Route>
        </Routes>
      }
    />
    }
    
    
    </> 
  )
}

export default App
