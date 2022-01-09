import { register, signInWithGoogle } from "../hooks/useAuth";
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from "react";
import store from "../store";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/authSlice";
import { useNavigate } from 'react-router';

const RegisterPage = () => {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');   
    const [fullname,setFullName] = useState('');  
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
                    <TextField id="name" label="Name" value={fullname} onChange={(text)=>setFullName(text.target.value)} variant="outlined" />
                    <TextField id="email" label="Enter the Email" value={email} onChange={(text)=>setEmail(text.target.value)} variant="outlined" />
                    <TextField type="password" id="password" label="Enter the Password" value={password} onChange={(text)=>setPassword(text.target.value)} variant="outlined" />
                </Box>

                <Button variant="contained" onClick={ ()=>register(email,password,fullname)}>Register</Button>
            </div>           
        </div>
    )
  }
  
  export default RegisterPage;