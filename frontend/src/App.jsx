import {useState} from 'react'
import './App.css'
import {Routes, Route, useLocation} from 'react-router'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'

import Classes from './components/classes/Classes'
import CreateClass from  './components/classes/CreateClass'
import EditClass from './components/classes/EditClass'
import ClassLandingPage from './components/classes/ClassLandingPage'
import { SelectedClassProvider } from './components/SelectedClassContext'

import SchoolYearHome from './components/school_year/SchoolYearHome'
import CreateSchoolYear from  './components/school_year/CreateSchoolYear'
import EditSchoolYear from  './components/school_year/EditSchoolYear'
import SchoolYearLanding from './components/school_year/SchoolYearLanding'

import CreateUnit from './components/units/CreateUnit'
import EditUnit from './components/units/EditUnit'
import UnitHome from './components/units/UnitHome'
import UnitLanding from './components/units/UnitLanding'

import NavBar from './components/navbar/navbar'

import ProtectedRoute from './components/ProtectedRoutes'

import PasswordResetRequest from './components/PasswordResetRequests'
import PasswordReset from './components/PasswordReset'

import Calendar1 from './components/Calendar1'
import { SchoolYearProvider } from './components/SchoolYearContext'
import { ClassProvider } from './components/ClassContext'
import { UnitProvider } from './components/UnitsContext'
import SchoolYearCalendar from './components/school_year/SchoolYearCalendar'


function App() {
  const location = useLocation()
  const noNavbar = location.pathname === "/register" || location.pathname === "/login" || location.pathname.includes("password")
  return (
    <SchoolYearProvider>
      <ClassProvider>
        <UnitProvider>
          <SelectedClassProvider>
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
                    <Route path='/classes' element={<Classes/>}/>
                    <Route path='/class/edit/:id' element={<EditClass/>}/>
                    <Route path='/class/create' element={<CreateClass/>}/> 
                    <Route path='/class/:id' element={<ClassLandingPage/>}/> 
                    <Route path='school_year/:id' element={<SchoolYearLanding/>}/>
                    <Route path='/school_year/create' element={<CreateSchoolYear/>}/>
                    <Route path='/school_year/edit/:id' element={<EditSchoolYear/>}/>
                    <Route path='/school_years' element={<SchoolYearHome/>}/>
                    <Route path='/calendar1' element={<Calendar1/>}/>
                    <Route path='/school_year/calendar/:id' element={<SchoolYearCalendar/>} />
                    <Route path='/units' element={<UnitHome/>} />
                    <Route path='/unit/:id' element={<UnitLanding/>} />
                    <Route path='/unit/create' element={<CreateUnit/>} /> 
                    <Route path='/unit/edit/:id' element={<EditUnit/>} /> 
                  </Route>
                </Routes>
              }
            />
            }
          </SelectedClassProvider>
        </UnitProvider>
      </ClassProvider>
    </SchoolYearProvider>
  )
}

export default App
