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

    const [name, setName] = useState(profile.username != null && profile.username != "null" ? profile.username : user.fullname?.split(/(\s+)/)[0])
    const [age, setAge] = useState(profile.age > 0 ? profile.age : "")
    const [height, setHeight] = useState(parseInt(profile.height) > 0 ? profile.height : "")
    const [rise, setRise] = useState(profile.rise_time != 0 && profile.rise_time != null ? getHour(true) : null);
    const [sleep, setSleep] = useState(profile.rise_time != 0 && profile.rise_time != null ? getHour() : null);

    let navigate = useNavigate();

    return (
        <div className="pages-wrapper">
            <div className="pages-inner">
                <div style={styles.flexColumnCenter} >
                    <h3>
                        {edit ? "Edit your profile" : "Complete your profile"}
                    </h3>

                    <Stack spacing={3} width={"100%"} alignItems={"center"} justifyContent={"center"} paddingY={2} >
                        <TextField inputProps={styles.formWebLabel} id="name" label="Name" value={name} onChange={(text) => setName(text.target.value)} variant="outlined" />
                        <TextField inputProps={styles.formWebLabel} id="age" label="Age" type="number" value={age} onChange={(text) => setAge(text.target.value)} variant="outlined" />
                        <TextField inputProps={styles.formWebLabel} id="height" label="Height" type="number" value={height} onChange={(text) => setHeight(text.target.value)} variant="outlined" />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <TimePicker
                                label="Rise time"
                                value={rise}
                                onChange={(newValue) => {
                                    setRise(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} InputProps={{ style: { fontSize: 18 } }} />}
                            />
                            <TimePicker
                                label="Sleep time"
                                value={sleep}
                                onChange={(newValue) => {
                                    setSleep(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} InputProps={{ style: { fontSize: 18 } }} />}
                            />
                        </LocalizationProvider>
                    </Stack>

                    <Button style={styles.buttonWeb} variant="contained" onClick={async () => {
                        let diz = {
                            username: name,
                            height: height,
                            age: age,
                            rise_time: makeTwoDigits(rise.getHours()) + ':' + makeTwoDigits(rise.getMinutes()),
                            sleep_time: makeTwoDigits(sleep.getHours()) + ':' + makeTwoDigits(sleep.getMinutes()),
                        };
                        store.dispatch(setProfile(diz));
                        updateUserProfile(user.uid, user.api_token, diz).then(navigate("/home"))
                    }}>{edit ? "Save" : "Let's start"}
                    </Button>

                </div>
            </div>
        </div>
    )
}

export default CreateProfile;