import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import RegisterPage from './components/Register';
import { useSelector } from "react-redux";
import { selectUser, selectProfile } from "./slices/authSlice";
import CreateProfile from './components/CreateProfile';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function RouterNav() {

  const user = useSelector(selectUser);
  const profile = useSelector(selectProfile);

  return (<>
    <BrowserRouter >
      <Routes>
        <Route path="/" element={user.fullname && profile.username && profile.username != "null" ? <Navigate to="/home" /> : user.fullname && !profile.username || profile.username == "null" ? <Navigate to="/createprofile" /> : <Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/createprofile' element={<CreateProfile />} />
        <Route path='/editprofile' element={<CreateProfile edit={true} />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </BrowserRouter>
  </>
  )
}
