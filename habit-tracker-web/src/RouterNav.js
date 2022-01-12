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
import { selectUser,selectProfile } from "./slices/authSlice";
import CreateProfile from './components/CreateProfile';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default function RouterNav() {
  
  //const [user, setUser] = useState();
  const user = useSelector(selectUser);
  const profile = useSelector(selectProfile);
  // useEffect(() => {
  //   if(user.fullname){

  //   }
  // }, [user])
  console.log(profile)
      return (<>
                    
          <BrowserRouter >                 
            <Routes>          
              <Route path="/" element={user.fullname && profile.username && profile.username!="null" ? <Navigate to="/home" /> : user.fullname && !profile.username || profile.username=="null" ? <Navigate to="/createprofile" /> : <Navigate to="/login" />}/>                    
              <Route path='/login' element={<Login/>} />  
              <Route path='/register' element={<RegisterPage/>}/>  
              <Route path='/createprofile' element={<CreateProfile/>}/> 
              <Route path='/home' element={<Home/>} />              
            </Routes>                
          </BrowserRouter>
                 
          
         </>
    )
}
