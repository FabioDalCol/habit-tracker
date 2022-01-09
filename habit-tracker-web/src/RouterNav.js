import React from 'react'
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route, Navigate
} from "react-router-dom";


import Login from './components/Login';
import Home from './components/Home';
import RegisterPage from './components/Register';
import { useState } from 'react';
import { useEffect } from 'react';
import { auth } from './firebase';
import firebase from "./hooks/useAuth"
import { useSelector } from "react-redux";
import { selectUser } from "./slices/authSlice";


export default function RouterNav() {
  
  //const [user, setUser] = useState();
  const user = useSelector(selectUser);
  // useEffect(() => {
  //   if(user.fullname){

  //   }
  // }, [user])

      return (      
        <BrowserRouter>                 
          <Routes>          
            <Route path="/" element={user.fullname ? <Navigate to="/home" /> : <Navigate to="/login" />}/> 
            <Route path='/home' element={<Home/>} />                    
            <Route path='/login' element={<Login/>} />  
            <Route path='/register' element={<RegisterPage/>}  />               
          </Routes>             
        </BrowserRouter>
    )
}
