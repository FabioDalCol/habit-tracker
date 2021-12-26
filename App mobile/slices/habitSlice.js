import { createSlice } from '@reduxjs/toolkit'
import { Timestamp } from '@firebase/firestore';
import { updateHabit, getDate, getTodayHabits } from '../Api';


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
            var today = getDate(); 
            const index = state.habits.findIndex( habit => habit.id == id);            
            state.habits[index].value++;
            state.habits[index].stats[today].value = state.habits[index].value;
            if(state.habits[index].value >= state.habits[index].set_value){    //if habit is completed add today (yyyy-mm--dd) to db
                var today = getDate();                                
                if (!state.habits[index].stats[today].completed ){
                    state.habits[index].stats[today].completed = true
                }
            }
            updateHabit(uid,token,state.habits[index],id)    //add rollback if api write fails
        },   
        decrementValue: (state, action) => {
            id = action.payload.id;
            uid = action.payload.uid;
            token = action.payload.token;
            var today = getDate(); 
            const index = state.habits.findIndex( habit => habit.id == id);
            if(state.habits[index].value>0){           
                state.habits[index].value--;                            
                state.habits[index].stats[today].value = state.habits[index].value;
                if(state.habits[index].value < state.habits[index].set_value){       //if Habit isn't completed removes it from the db for today
                    var today = getDate();                                   
                    if (state.habits[index].stats[today].completed){
                        state.habits[index].stats[today].completed = false
                    }
                }
                updateHabit(uid,token,state.habits[index],id)        //add rollback if api write fails
            }
        }, 
        setValue: (state, action) => {                                          //set without calling API update
            id = action.payload.id;
            value = action.payload.value            
            var today = getDate(); 
            const index = state.habits.findIndex( habit => habit.id == id);                    
            state.habits[index].value = value;                            
            state.habits[index].stats[today].value = state.habits[index].value;
            if(state.habits[index].value < state.habits[index].set_value){                                                 
                if (state.habits[index].stats[today].completed){
                    state.habits[index].stats[today].completed = false
                }
            }
            else {                                                  
                if (!state.habits[index].stats[today].completed ){
                    state.habits[index].stats[today].completed = true
                } 
            }          
        },
        pushValue: (state, action) => {                                          
            id = action.payload.id;
            uid = action.payload.uid;
            token = action.payload.token;          
            const index = state.habits.findIndex( habit => habit.id == id);                    
            updateHabit(uid,token,state.habits[index],id)                     
        }, 
        triggerCompleted: (state, action) => {
            id = action.payload.id;
            uid = action.payload.uid;           
            token = action.payload.token;
            const index = state.habits.findIndex( habit => habit.id == id);         
            var today = getDate();           
            state.habits[index].stats[today].completed = !state.habits[index].stats[today].completed;
            updateHabit(uid,token,state.habits[index],id)             
        },
        initDay: (state, action) => {            
            uid = action.payload.uid;           
            token = action.payload.token; 
            var today = getDate();                    
            for (var habId of getTodayHabits(state.habits)){
                const index = state.habits.findIndex( habit => habit.id == habId);                    
                if(state.habits[index].stats == undefined) state.habits[index].stats = {};
                if (state.habits[index].countable){
                    if(state.habits[index].stats[today] == undefined){
                        state.habits[index].stats[today] = {}
                        state.habits[index].stats[today].set_value = state.habits[index].set_value
                        state.habits[index].value = 0;
                        state.habits[index].stats[today].value = state.habits[index].value
                        state.habits[index].stats[today].completed = false
                        updateHabit(uid,token,state.habits[index],habId)                         
                    }
                }
                else {
                    if(state.habits[index].stats[today] == undefined){
                        state.habits[index].stats[today] = {}
                        state.habits[index].stats[today].completed = false
                        updateHabit(uid,token,state.habits[index],habId)                        
                    }
                }                            
            }                         
        },  
        setIsActive: (state, action) => {                                          //set without calling API update
            id = action.payload.id;
            uid = action.payload.uid;
            token = action.payload.token;  
            console.log('CI SONOOOOOOOOOOOOo');
            const index = state.habits.findIndex( habit => habit.id == id);                    
            state.habits[index].is_active = !state.habits[index].is_active;   
            console.log(!state.habits[index].is_active);                        
            updateHabit(uid,token,state.habits[index],id)                                           
        }    
    }
})

export const { setIsActive, setHabits, setRefreshing, incrementValue, decrementValue, triggerCompleted, initDay, setValue, pushValue} = habitSlice.actions;

export const selectHabits = (state) => state.hab.habits;
export const selectRefreshing = (state) => state.hab.refreshing;


export default habitSlice.reducer;