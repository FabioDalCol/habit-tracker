import React from 'react'
import { useEffect, useState } from 'react';
import * as Mui from '@mui/material';
import Drink from '@mui/icons-material/LocalDrink';
import Walk from '@mui/icons-material/DirectionsWalk';
import Custom from '@mui/icons-material/EmojiEvents';
import Add from '@mui/icons-material/AddCircleOutline';
import Minus from '@mui/icons-material/RemoveCircleOutline';
import { amber } from '@mui/material/colors';
import Star from '@mui/icons-material/Star';
import StarIcon from '@mui/icons-material/StarBorder';
import store from '../store';
import { useSelector } from 'react-redux';
import { selectUser } from '../slices/authSlice';
import { setValue, pushValue, incrementValue, decrementValue, triggerCompleted } from '../slices/habitSlice';
import { styleColors } from '../colors';
import { useDebouncedEffect } from './useDebounceEffect'

const rendericon = (category) => {
    switch (category) {
        case 'Custom':
            return <Custom sx={{ fontSize: 40, color: '#ffc600' }} />
        case 'Drink':
            return <Drink sx={{ fontSize: 40, color: '#2acaea' }} />
        case 'Walk':
            return <Walk sx={{ fontSize: 40, color: '#B6134A' }} />
    }
}


export const Habit = ({ id, name = 'Default', date, category, desc, countable, value = null, set_value = null, completeToday, manage_habits = false, is_active, created, show = false, habitToEdit, setHabitToEdit, times, reminder, mon, tue, wed, thu, fri, sat, sun, pedometer = null }) => {

    const user = useSelector(selectUser);
    const uid = user.uid
    const api_token = user.api_token;


    useDebouncedEffect(() => store.dispatch(pushValue({ id: id, uid: uid, token: api_token })), [value], 1000);

    return (
        <Mui.Card style={{ marginBottom: 10 }} >
            <Mui.Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', border: completeToday ? '4px solid green' : '' }}  >
                <div style={{ flexDirection: 'row', display: 'flex' }}>
                    <div>
                        {rendericon(category)}
                    </div>
                    <div>
                        <Mui.Stack spacing={0.5} marginLeft='7%'>
                            <Mui.Typography fontWeight={700}>{name}</Mui.Typography>
                            <Mui.Typography variant="body2" color="text.secondary">
                                {desc}
                            </Mui.Typography>
                        </Mui.Stack>
                    </div>
                </div>
                {/* <Mui.IconButton onPress={()=>console.log('edito')}>
                                <Edit />
                            </Mui.IconButton> */}
                <div>
                    {category != "Custom" ? (<>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignContent: 'flex-end' }}>
                            <div style={{ display: 'flex', flexDirection: "row", alignItems: 'center', alignContent: "flex-end", justifyItems: "flex-end" }}>
                                <input
                                    type='text'
                                    style={{ width: 10 + String(value).length * 10, height: 20, borderRadius: 20, fontWeight: 650, textAlign: 'center', marginRight: 2, borderColor: styleColors.greyish }}
                                    value={String(value)}
                                    onChange={(event) => store.dispatch(setValue({ id: id, value: event.target.value ? parseInt(event.target.value) : 0, date: date }))}
                                    onBlur={() => { store.dispatch(pushValue({ id: id, uid: uid, token: api_token })) }}
                                    size='small'
                                />
                                <Mui.Typography fontWeight={700}>/{set_value}</Mui.Typography>
                            </div>

                            <div style={{ flexDirection: "row", alignSelf: "flex-end", justifyContent: "flex-end" }}>
                                <Mui.IconButton onClick={() => store.dispatch(incrementValue({ id: id, uid: uid, token: api_token, date: date }))} style={{ marginRight: -10 }}>
                                    <Add sx={{ fontSize: 25, color: category == "Walk" ? '#B6134A' : '#2acaea' }} />
                                </Mui.IconButton>
                                <Mui.IconButton onClick={() => store.dispatch(decrementValue({ id: id, uid: uid, token: api_token, date: date }))}>
                                    <Minus sx={{ fontSize: 25, color: category == "Walk" ? '#B6134A' : '#2acaea' }} />
                                </Mui.IconButton>
                            </div>
                        </div>
                    </>)
                        :
                        (<Mui.Checkbox onClick={() => store.dispatch(triggerCompleted({ id: id, uid: uid, token: api_token, date: date }))} checked={completeToday} sx={{
                            color: amber[800],
                            '&.Mui-checked': {
                                color: amber[400],
                            }
                        }}
                            icon={<StarIcon sx={{ fontSize: 30 }} />}
                            checkedIcon={<Star sx={{ fontSize: 30 }} />}
                        />)}
                </div>
            </Mui.Box>
        </Mui.Card >
    )
}
