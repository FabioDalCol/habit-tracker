import { register, signInWithGoogle } from "../hooks/useAuth";
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from "react";
import store from "../store";
import { useSelector } from "react-redux";
import { selectUser,setProfile } from "../slices/authSlice";
import { useNavigate } from 'react-router';
import { updateUserProfile } from "../Api";
import { async } from "@firebase/util";

const CreateProfile = () => {

    const [name,setName] = useState()
    const [age,setAge] = useState()
    const [height,setHeight] = useState()
    var sleep_time="22:30";
    var rise_time="10:40";   
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
                    style={{flexDirection:"row"}}
                >
                    <TextField id="name" label="Name" value={name} onChange={(text)=>setName(text.target.value)} variant="outlined" />
                    <TextField id="age" label="Age" type="number" value={age} onChange={(text)=>setAge(text.target.value)} variant="outlined" />
                    <TextField id="height" label="Height" type="number" value={height} onChange={(text)=>setHeight(text.target.value)} variant="outlined" />                    
                </Box>
                <Button variant="contained" onClick={ async()=>{
                                                            let diz = {
                                                                    username: name,
                                                                    height: height,
                                                                    age:age,                   
                                                                    rise_time: rise_time,
                                                                    sleep_time: sleep_time,                       
                                                                    };
                                                            store.dispatch(setProfile(diz));
                                                            await updateUserProfile(user.uid,user.api_token,diz).then(navigate("/home"))
                                                            }}>Let's start
                </Button>
            </div>           
        </div>
    )
  }
  
  export default CreateProfile;