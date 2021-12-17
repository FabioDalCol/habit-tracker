import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    habits: null,
    refreshing: false   
}

export const habitSlice = createSlice({
    name: 'hab',
    initialState,
    reducers: {
        setHabits: (state, action) => {
            state.habits = action.payload;
        }, 
        setRefreshing: (state, action) => {
            state.habits = action.payload;
        },              
    }
})

export const { setHabits, setRefreshing} = habitSlice.actions;

export const selectHabits = (state) => state.hab.habits;
export const selectRefreshing = (state) => state.hab.refreshing;


export default habitSlice.reducer;