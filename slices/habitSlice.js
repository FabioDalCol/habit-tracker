import { createSlice } from '@reduxjs/toolkit'
import { Timestamp } from '@firebase/firestore';

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
        incrementValue: (state, action) => {
            id = action.payload;
            const index = state.habits.findIndex( habit => habit.id == id);            
            state.habits[index].value++;
        },   
        decrementValue: (state, action) => {
            id = action.payload;
            const index = state.habits.findIndex( habit => habit.id == id);
            if(state.habits[index].value>0)
                state.habits[index].value--;
        }, 
        setCompleted: (state, action) => {
            id = action.payload;
            const index = state.habits.findIndex( habit => habit.id == id);
            var date = new Date();  
            //Math.floor(Date.now() / 1000)          
            state.habits[index].completed.push(date.getTime());
        },              
    }
})

export const { setHabits, setRefreshing, incrementValue, decrementValue, setCompleted} = habitSlice.actions;

export const selectHabits = (state) => state.hab.habits;
export const selectRefreshing = (state) => state.hab.refreshing;


export default habitSlice.reducer;