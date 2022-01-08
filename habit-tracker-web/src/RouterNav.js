import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route
  } from "react-router-dom";

import Login from './components/Login';
import Home from './components/Home';
import { useState } from 'react';
import { useEffect } from 'react';
import { auth } from './firebase';

export default function RouterNav() {
  
  const [user, setUser] = useState(null);
  useEffect(() => {
    auth().onAuthStateChanged(user => {
      setUser(user);
    })
  }, [])

  console.log(user);
    return (
        <Router>
          <Route path='/' element={<Login />} />
        <>
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
        </>      
        </Router>
    )
}
