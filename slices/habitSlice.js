import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    habits: null      
}

export const habitSlice = createSlice({
    name: 'hab',
    initialState,
    reducers: {
        setHabits: (state, action) => {
            state.habits = action.payload;
        },             
    }
})

export const { setHabits} = habitSlice.actions;

export const selectHabits = (state) => state.hab.habits;


export default habitSlice.reducer;