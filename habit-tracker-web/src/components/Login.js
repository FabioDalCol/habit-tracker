import { signInWithGoogle } from "../hooks/useAuth";
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from "react";
import store from "../store";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/authSlice";
import { useNavigate } from 'react-router';
import { signin } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const Login = () => {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');   
    const user = useSelector(selectUser);
    let navigate = useNavigate();
    console.log(user)
    return (
        <div>
            <div>
                <div className="heading-container">
                    <h3>
                        Login Form
                    </h3>
                </div>

                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField id="email" label="Enter the Email" value={email} onChange={(text)=>setEmail(text.target.value)} variant="outlined" />
                    <TextField type="password" id="password" label="Enter the Password" value={password} onChange={(text)=>setPassword(text.target.value)} variant="outlined" />
                </Box>

                <Button variant="contained" onClick={ ()=>signin(email,password)}>Log in</Button>
                <Button variant="contained" onClick={ ()=>navigate("/register")}>Register</Button>
            </div>
            <div>
                <Button className="button" onClick={ signInWithGoogle}><i className="fab fa-google"></i>Sign in with google</Button>
                
            </div>
        </div>
    )
  }
  
  export default Login;