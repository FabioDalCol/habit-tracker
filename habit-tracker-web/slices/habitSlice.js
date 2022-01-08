import { createSlice } from '@reduxjs/toolkit'
import { Timestamp } from '@firebase/firestore';
import getHabits,{ updateHabit, updateHabitNoRetrieve, getDate, getTodayHabits,getOnlyHabit } from '../Api';
import { walkToday } from '../Api';
import moment from 'moment';

const getDaysBetweenDates = (startDate, endDate) => {
    var now = startDate.clone(), dates = [];
    while (now.isSameOrBefore(endDate)) {
        dates.push(now.format('YYYY-MM-DD'));
        now.add(1, 'days');
    }
    return dates
}

const initialState = {
    habits: null,
    refreshing: false,
    notifDB:{},
    pedometerIsActive:false,       
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
            today = action.payload.date;                    
            habits= JSON.parse(JSON.stringify(state.habits));           
            const index = state.habits.findIndex( habit => habit.id == id);
            if(state.habits[index].category=="Walk")
                habits= {}
            if(today==getDate())
            {           
                state.habits[index].value++;
                state.habits[index].stats[today].value = state.habits[index].value;                             
                if(state.habits[index].value >= state.habits[index].set_value){    //if habit is completed add today (yyyy-mm--dd) to db                               
                    if (!state.habits[index].stats[today].completed ){
                        state.habits[index].stats[today].completed = true
                    }
                }
                if(state.habits[index].category=="Walk"){
                    for(id of walkToday(state.habits)){                        
                        updateHabitNoRetrieve(uid,token,getOnlyHabit(state.habits,id),id)  
                        console.log(getOnlyHabit(state.habits,id).value)                         
                    }
                    getHabits(uid, token,habits)
                }
                else{           
                updateHabit(uid,token,state.habits[index],id,habits) 
                }  
            }
            else
            {
                state.habits[index].stats[today].value++;
                if(state.habits[index].stats[today].value >= state.habits[index].stats[today].set_value){    //if habit is completed add today (yyyy-mm--dd) to db                               
                    if (!state.habits[index].stats[today].completed ){
                        state.habits[index].stats[today].completed = true
                    }
                }
                updateHabit(uid,token,state.habits[index],id,habits)    
            }           
        },   
        decrementValue: (state, action) => {
            id = action.payload.id;
            uid = action.payload.uid;
            token = action.payload.token;
            today = action.payload.date; 
            habits= JSON.parse(JSON.stringify(state.habits));           
            const index = state.habits.findIndex( habit => habit.id == id);
            if(state.habits[index].category=="Walk")
                habits= {}                         
            if(today==getDate())
            {          
                if(state.habits[index].value>0){           
                    state.habits[index].value--;                            
                    state.habits[index].stats[today].value = state.habits[index].value;
                    if(state.habits[index].value < state.habits[index].set_value){       //if Habit isn't completed removes it from the db for today                                 
                        if (state.habits[index].stats[today].completed){
                            state.habits[index].stats[today].completed = false
                        }
                    } 
                    if(state.habits[index].category=="Walk"){
                        for(id of walkToday(state.habits)){                            
                            updateHabitNoRetrieve(uid,token,getOnlyHabit(state.habits,id),id)                           
                        }
                        getHabits(uid, token,habits)
                    }
                    else{           
                    updateHabit(uid,token,state.habits[index],id,habits) 
                    }       
                }
            }
            else
            {
                if(state.habits[index].stats[today].value>0){                                           
                    state.habits[index].stats[today].value--;
                    if(state.habits[index].stats[today].value < state.habits[index].stats[today].set_value){       //if Habit isn't completed removes it from the db for today                                 
                        if (state.habits[index].stats[today].completed){
                            state.habits[index].stats[today].completed = false
                        }
                    }
                    updateHabit(uid,token,state.habits[index],id,habits)        //add rollback if api write fails
                }
            }            
        }, 
        setValue: (state, action) => {                                          //set without calling API update
            id = action.payload.id;
            value = action.payload.value;            
            today = action.payload.date;             
            const index = state.habits.findIndex( habit => habit.id == id); 
            if(today==getDate())
            {                   
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
            }      
            else
            {                        
                state.habits[index].stats[today].value = value;
                if(state.habits[index].stats[today].value < state.habits[index].stats[today].set_value){                                                 
                    if (state.habits[index].stats[today].completed){
                        state.habits[index].stats[today].completed = false
                    }
                }
                else {                                                  
                    if (!state.habits[index].stats[today].completed ){
                        state.habits[index].stats[today].completed = true
                    } 
                } 
            }  
        },
        pushValue: (state, action) => {                                          
            id = action.payload.id;
            uid = action.payload.uid;
            token = action.payload.token;                
            habits= JSON.parse(JSON.stringify(state.habits));           
            const index = state.habits.findIndex( habit => habit.id == id);
            if(state.habits[index].category=="Walk"){
                for(id of walkToday(state.habits)){                            
                    updateHabitNoRetrieve(uid,token,getOnlyHabit(state.habits,id),id)                           
                }
                getHabits(uid, token,habits) 
            }  
            else{      
                updateHabit(uid,token,state.habits[index],id,habits) 
            }                    
        }, 
        triggerCompleted: (state, action) => {
            id = action.payload.id;
            uid = action.payload.uid;           
            token = action.payload.token;
            habits= JSON.parse(JSON.stringify(state.habits));
            const index = state.habits.findIndex( habit => habit.id == id);         
            today = action.payload.date;          
            state.habits[index].stats[today].completed = !state.habits[index].stats[today].completed;
            updateHabit(uid,token,state.habits[index],id,habits)             
        },
        initDay: (state, action) => {            
            uid = action.payload.uid;           
            token = action.payload.token; 
            var today = getDate();      
            var edited = false;
            for (var habId of getTodayHabits(state.habits)){
                const index = state.habits.findIndex( habit => habit.id == habId); 
                var first_date=[moment(today).add(-7, 'days'), moment(state.habits[index].created)].sort()[1]           
                var days = getDaysBetweenDates(first_date,moment(today))                      
                if(state.habits[index].stats == undefined) state.habits[index].stats = {};
                if (state.habits[index].countable){
                    for(var day of days)
                        if(state.habits[index].stats[day] == undefined){
                            state.habits[index].stats[day] = {}
                            state.habits[index].stats[day].set_value = state.habits[index].set_value
                            state.habits[index].stats[day].value = 0
                            state.habits[index].stats[day].completed = false 
                            if(day==today)
                                state.habits[index].value = 0;
                            edited = true;                       
                        }
                        if(edited)
                            updateHabit(uid,token,state.habits[index],habId); 
                        edited = false;
                }
                else {
                    for(var day of days)   
                        if(state.habits[index].stats[day] == undefined){
                            state.habits[index].stats[day] = {}
                            state.habits[index].stats[day].completed = false                      
                        }
                        if(edited)
                            updateHabit(uid,token,state.habits[index],habId); 
                        edited = false; 
                }                            
            }                         
        },  
        setIsActive: (state, action) => {                                          
            id = action.payload.id;
            uid = action.payload.uid;
            token = action.payload.token;  
            const index = state.habits.findIndex( habit => habit.id == id);                    
            state.habits[index].is_active = !state.habits[index].is_active;                      
            updateHabit(uid,token,state.habits[index],id)                                           
        }, 

     

         
        

    }
})

export const { setIsActive, setHabits, setRefreshing, incrementValue, decrementValue, triggerCompleted, initDay, setValue, pushValue,  } = habitSlice.actions;

export const selectHabits = (state) => state.hab.habits;
export const selectRefreshing = (state) => state.hab.refreshing;
export const selectNotifDB = (state) => state.hab.notifDB;
export const selectPedometer = (state) => state.hab.pedometerIsActive;

export default habitSlice.reducer;