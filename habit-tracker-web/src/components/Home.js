import React from 'react';
import { useEffect } from 'react';
import { auth } from '../firebase';
import { useSelector } from "react-redux";
import { selectUser, selectProfile } from "../slices/authSlice";
import { selectHabits } from '../slices/habitSlice';
import { logout } from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import getHabits from '../Api';

import '../App.css';

const Home = () => {
    let navigate = useNavigate();
    const user = useSelector(selectUser);
    const profile = useSelector(selectProfile);
    const habits = useSelector(selectHabits)

    const uid = user.uid
    const api_token = user.api_token;

    useEffect(() => {   
        getHabits(uid,api_token,{})
        }, [])

    console.log(user)
    console.log(profile)
    console.log(habits)
    return (
        <div className="home">
        <h1>Hello, <span></span>{user.fullname}</h1>
        <img src={user.photo_url} alt="" />
        <button className="button signout" onClick={() => {logout();  navigate('/')}}>Sign out</button>
        </div>
   
  )
}

export default Home;