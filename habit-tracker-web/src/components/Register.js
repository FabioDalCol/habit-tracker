import * as React from 'react';
import { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Stack } from "@mui/material";
import { register } from "../hooks/useAuth";
import { styles } from "../styles";
import toast, { Toaster } from 'react-hot-toast';


const RegisterPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullName] = useState('');
    const [validate, setValidate] = useState({ email: false, password: false, fullname: false })
    const errorText = { email: "Min 6 chars Max 128 chars", password: "Min 6 chars Max 128 chars", fullname: "Min 3 chars Max 128 chars" }

    const validation = () => {
        var error = { email: false, password: false, fullname: false }
        if (password.length < 6 || password.length > 128) error.password = true;
        if (email.length < 6 || email.length > 128) error.email = true;
        if (fullname.length < 3 || fullname.length > 128) error.fullname = true;
        setValidate(error)
        return !Object.values(error).reduce((a, b) => a + b)  //return true if all fields validate        
    }

    return (
        <div className="pages-wrapper">
            <div className="pages-inner">
                <Toaster />
                <div className="heading-container">
                    <h3>
                        Sign up
                    </h3>
                </div>

                <Stack spacing={3} width={"100%"} alignItems={"center"} justifyContent={"center"} paddingY={2} >
                    <TextField error={validate.fullname} helperText={validate.fullname && errorText.fullname} inputProps={styles.formWebLabel} id="name" label="Name" value={fullname} onChange={(text) => setFullName(text.target.value)} variant="outlined" />
                    <TextField error={validate.email} helperText={validate.email && errorText.email} inputProps={styles.formWebLabel} id="email" label="Email" value={email} onChange={(text) => setEmail(text.target.value)} variant="outlined" />
                    <TextField error={validate.password} helperText={validate.password && errorText.password} inputProps={styles.formWebLabel} type="password" id="password" label="Password" value={password} onChange={(text) => setPassword(text.target.value)} variant="outlined" />
                </Stack>

                <div style={styles.flexColumnCenter}>
                    <Button style={styles.buttonWeb} variant="contained" onClick={() => { validation() ? register(email, password, fullname) : toast("Invalid input") }}>Register</Button>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage;