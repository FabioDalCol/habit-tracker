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
import { Stack } from "@mui/material";
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
                <div style={{display:"flex",alignItems:"center",flexDirection:"column"}} >
                    <h3>
                        Habit tracker
                    </h3>
                    <img src={require("../images/habit.png")} 
                    style={{ width: 200, height: 200, display:"flex", alignSelf:"center", }}
                    />
                </div>

                <Stack spacing={3} width={"100%"} alignItems={"center"} justifyContent={"center"} paddingY={2} >
                    <TextField inputProps={{style: {fontSize: 18}}}  id="email" label="Email" value={email} onChange={(text)=>setEmail(text.target.value)} variant="outlined" />
                    <TextField inputProps={{style: {fontSize: 18}}} type="password" id="password" label="Password" value={password} onChange={(text)=>setPassword(text.target.value)} variant="outlined" />
                </Stack>            

            </div>
            <div style={{display:"flex",alignItems:"center",flexDirection:"column"}}>                
                <Button style={{borderRadius:30,marginBottom:5,fontSize:18}} variant="contained" onClick={ ()=>signin(email,password)}>Login</Button>
                <Button style={{borderRadius:30,marginBottom:5,fontSize:18}} variant="contained" onClick={ ()=>navigate("/register")}>Register</Button>
                <Button style={{borderRadius:30,marginBottom:5,fontSize:18,backgroundColor:"#ef4444"}} variant ="contained" onClick={ signInWithGoogle}><i className="fab fa-google"></i>Sign in with google</Button>
                
            </div>
        </div>
    )
  }
  
  export default Login;