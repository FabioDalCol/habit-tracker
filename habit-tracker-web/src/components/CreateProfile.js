import * as React from 'react';
import { useState } from "react";
import { useNavigate } from 'react-router';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import { Stack } from "@mui/material";
import store from "../store";
import { useSelector } from "react-redux";
import { selectProfile, selectUser, setProfile } from "../slices/authSlice";
import { updateUserProfile } from "../Api";
import { styles } from "../styles";
import toast, { Toaster } from 'react-hot-toast';


const makeTwoDigits = (time) => {
    const timeString = `${time}`;
    if (timeString.length === 2) return time
    return `0${time}`
}

const CreateProfile = ({ edit = false }) => {
    const profile = useSelector(selectProfile);
    const user = useSelector(selectUser);

    const getHour = (rise = false) => {
        var datenow = new Date();
        var hours;
        rise ? hours = profile.rise_time.split(":") : hours = profile.sleep_time.split(":")
        return new Date(datenow.setHours(hours[0], hours[1], 0))
    }
    const date = new Date()
    const [name, setName] = useState(profile.username != null && profile.username != "null" ? profile.username : user.fullname?.split(/(\s+)/)[0])
    const [age, setAge] = useState(profile.age > 0 ? profile.age : "")
    const [height, setHeight] = useState(parseInt(profile.height) > 0 ? profile.height : "")
    const [rise, setRise] = useState(profile.rise_time != 0 && profile.rise_time != null ? getHour(true) : new Date(date.setHours(7, 0, 0)));
    const [sleep, setSleep] = useState(profile.rise_time != 0 && profile.rise_time != null ? getHour() : new Date(date.setHours(23, 0, 0)));
    const [validate, setValidate] = useState({ name: false, age: false, height: false, hours: false })
    const errorText = { name: "Min 3 chars Max 128 chars", age: "Age should be >= 12 and <= 120", height: "Height should be >= 80 and <= 250", hours: "Sleep and Rise time cannot be void" }

    const validation = () => {
        var error = { name: false, age: false, height: false }
        if (name.length < 3 || name.length > 128) error.name = true;
        if (age < 12 || age > 120) error.age = true;
        if (height < 80 || height > 250) error.height = true;
        if (rise == null || sleep == null) { error.hours = true; toast(errorText.hours) }
        setValidate(error)
        return !Object.values(error).reduce((a, b) => a + b)  //return true if all fields validate        
    }

    let navigate = useNavigate();

    return (
        <div className="pages-wrapper">
            <div className="pages-inner">
                <Toaster />
                <div style={styles.flexColumnCenter} >
                    <h3>
                        {edit ? "Edit your profile" : "Complete your profile"}
                    </h3>

                    <Stack spacing={3} width={"100%"} alignItems={"center"} justifyContent={"center"} paddingY={2} >
                        <TextField error={validate.name} helperText={validate.name && errorText.name} inputProps={styles.formWebLabel} id="name" label="Name" value={name} onChange={(text) => setName(text.target.value)} variant="outlined" />
                        <TextField error={validate.age} helperText={validate.age && errorText.age} inputProps={styles.formWebLabel} id="age" label="Age" type="number" value={age} onChange={(text) => setAge(text.target.value)} variant="outlined" />
                        <TextField error={validate.height} helperText={validate.height && errorText.height} inputProps={styles.formWebLabel} id="height" label="Height" type="number" value={height} onChange={(text) => setHeight(text.target.value)} variant="outlined" />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <TimePicker
                                label="Rise time"
                                value={rise}
                                ampm={false}
                                onChange={(newValue) => {
                                    setRise(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} InputProps={{ style: { fontSize: 18 } }} />}
                            />
                            <TimePicker
                                label="Sleep time"
                                value={sleep}
                                ampm={false}
                                onChange={(newValue) => {
                                    setSleep(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} InputProps={{ style: { fontSize: 18 } }} />}
                            />
                        </LocalizationProvider>
                    </Stack>

                    <Button style={styles.buttonWeb} variant="contained" onClick={async () => {
                        if (validation()) {
                            let diz = {
                                username: name,
                                height: height,
                                age: age,
                                rise_time: makeTwoDigits(rise.getHours()) + ':' + makeTwoDigits(rise.getMinutes()),
                                sleep_time: makeTwoDigits(sleep.getHours()) + ':' + makeTwoDigits(sleep.getMinutes()),
                            };
                            store.dispatch(setProfile(diz));
                            updateUserProfile(user.uid, user.api_token, diz).then(navigate("/home"))
                        }
                        else {
                            toast("Invalid input")
                        }
                    }}>{edit ? "Save" : "Let's start"}
                    </Button>

                </div>
            </div>
        </div>
    )
}

export default CreateProfile;