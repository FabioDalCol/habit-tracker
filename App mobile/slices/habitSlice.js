import { createSlice } from '@reduxjs/toolkit'
import { Timestamp } from '@firebase/firestore';
import { updateHabit, getDate } from '../Api';


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
            id = action.payload.id;
            uid = action.payload.uid;
            token = action.payload.token;
            const index = state.habits.findIndex( habit => habit.id == id);            
            state.habits[index].value++;
            if(state.habits[index].value >= state.habits[index].set_value){    //if habit is completed add today (yyyy-mm--dd) to db
                var today = getDate();
                var existIndex = state.habits[index].completed.indexOf(today)                  
                if (existIndex<0){
                    state.habits[index].completed.push(today)
                }
            }
            updateHabit(uid,token,state.habits[index],id)    //add rollback if api write fails
        },   
        decrementValue: (state, action) => {
            id = action.payload.id;
            uid = action.payload.uid;
            token = action.payload.token;
            const index = state.habits.findIndex( habit => habit.id == id);
            if(state.habits[index].value>0){           
                state.habits[index].value--;
                if(state.habits[index].value < state.habits[index].set_value){       //if Habit isn't completed removes it from the db for today
                    var today = getDate();
                    var existIndex = state.habits[index].completed.indexOf(today)                 
                    if (existIndex>=0){
                        state.habits[index].completed.splice(existIndex,1)
                    }
                }
                updateHabit(uid,token,state.habits[index],id)        //add rollback if api write fails
            }
        }, 
        triggerCompleted: (state, action) => {
            id = action.payload.id;
            uid = action.payload.uid;           
            token = action.payload.token;
            const index = state.habits.findIndex( habit => habit.id == id);         
            var today = getDate();
            var existIndex = state.habits[index].completed.indexOf(today)
            if (existIndex<=0){
                state.habits[index].completed.push(today)
            }
            else {
                state.habits[index].completed.splice(existIndex,1)
            }
            updateHabit(uid,token,state.habits[index],id)             
        },              
    }
})

export const { setHabits, setRefreshing, incrementValue, decrementValue, triggerCompleted} = habitSlice.actions;

export const selectHabits = (state) => state.hab.habits;
export const selectRefreshing = (state) => state.hab.refreshing;


export default habitSlice.reducer;