import React from 'react';

import { auth } from '../firebase';
import { useSelector } from "react-redux";
import { selectUser } from "../slices/authSlice";
import { logout } from '../hooks/useAuth';
import { useNavigate } from 'react-router';

import '../App.css';

const Home = () => {
    let navigate = useNavigate();
    const user = useSelector(selectUser);
    return (
        <div className="home">
        <h1>Hello, <span></span>{user.fullname}</h1>
        <img src={user.photo_url} alt="" />
        <button className="button signout" onClick={() => {logout();  navigate('/')}}>Sign out</button>
        </div>
   
  )
}

export default Home;