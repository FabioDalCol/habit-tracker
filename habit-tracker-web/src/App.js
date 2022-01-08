

import './App.css';
import Login from './components/Login';
import RouterNav from './RouterNav';
import { useState } from 'react';
import { useEffect } from 'react';
import { auth } from './firebase';
import {
  BrowserRouter,
  Routes,
  Route, Switch
} from "react-router-dom";



function App() { 

  const [user, setUser] = useState(null);
  
  // useEffect(() => {
  //   auth().onAuthStateChanged(user => {
  //     setUser(user);
  //   })
  // }, [])

  return (    
    <RouterNav/>
  );
}

export default App;