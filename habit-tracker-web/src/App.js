

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
import store, {persistor} from './store';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from "react-redux"




function App() { 

  const [user, setUser] = useState(null);
  
  // useEffect(() => {
  //   auth().onAuthStateChanged(user => {
  //     setUser(user);
  //   })
  // }, [])

  return (   
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterNav/>
      </PersistGate>
    </Provider>
  );
}

export default App;