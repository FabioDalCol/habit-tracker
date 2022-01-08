import React from 'react'
import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route, Switch
} from "react-router-dom";

import Login from './components/Login';
import Home from './components/Home';
import { useState } from 'react';
import { useEffect } from 'react';
import { auth } from './firebase';
import firebase from "./hooks/useAuth"

export default function RouterNav() {
  
  const [user, setUser] = useState();
  
  useEffect(() => {
    console.log(user)
  }, [])

      return (      
        <BrowserRouter>                 
          <Routes>            
          {user ? 
            <Route path='/home' element={<Home/>} />
            :
            <>           
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Login />} />
            </> 
          }
          </Routes>             
        </BrowserRouter>
    )
}
