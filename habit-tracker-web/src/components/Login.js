import * as React from 'react';
import { useState } from "react";
import { useNavigate } from 'react-router';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/authSlice";
import { signin, signInWithGoogle } from "../hooks/useAuth";
import { styles } from "../styles";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const user = useSelector(selectUser);
    let navigate = useNavigate();

    return (
        <div className="pages-wrapper">
            <div className="pages-inner">
                <div>
                    <div style={styles.flexColumnCenter} >
                        <h3>
                            Habit tracker
                        </h3>
                        <img src={require("../images/habit.png")}
                            style={styles.mainImage}
                        />
                    </div>

                    <Stack spacing={3} width={"100%"} alignItems={"center"} justifyContent={"center"} paddingY={2} >
                        <TextField inputProps={{ style: { fontSize: 18 } }} id="email" label="Email" value={email} onChange={(text) => setEmail(text.target.value)} variant="outlined" />
                        <TextField inputProps={{ style: { fontSize: 18 } }} type="password" id="password" label="Password" value={password} onChange={(text) => setPassword(text.target.value)} variant="outlined" />
                    </Stack>

                </div>
                <div style={styles.flexColumnCenter}>
                    <Button style={styles.buttonWeb} variant="contained" onClick={() => signin(email, password)}>Sign In</Button>
                    <Button style={styles.buttonWeb} variant="contained" onClick={() => navigate("/register")}>Register</Button>
                    <Button style={styles.buttonGoogleWeb} variant="contained" onClick={signInWithGoogle}><i className="fab fa-google"></i>Sign in with google</Button>

                </div>
            </div>
        </div>
    )
}

export default Login;