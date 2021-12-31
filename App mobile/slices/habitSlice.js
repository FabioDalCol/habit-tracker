import { createSlice } from '@reduxjs/toolkit'
import { Timestamp } from '@firebase/firestore';
import { updateHabit, getDate, getTodayHabits } from '../Api';
import * as Notifications from 'expo-notifications';



const initialState = {
    habits: null,
    refreshing: false,
    notifDB:{},       
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
            const index = state.habits.findIndex( habit => habit.id == id); 
            if(today==getDate())
            {           
                state.habits[index].value++;
                state.habits[index].stats[today].value = state.habits[index].value;

                if(state.habits[index].value >= state.habits[index].set_value){    //if habit is completed add today (yyyy-mm--dd) to db                               
                    if (!state.habits[index].stats[today].completed ){
                        state.habits[index].stats[today].completed = true
                    }
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
            }

            updateHabit(uid,token,state.habits[index],id)    //add rollback if api write fails
        },   
        decrementValue: (state, action) => {
            id = action.payload.id;
            uid = action.payload.uid;
            token = action.payload.token;
            today = action.payload.date; 
            const index = state.habits.findIndex( habit => habit.id == id);
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
                    updateHabit(uid,token,state.habits[index],id)        //add rollback if api write fails
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
                    updateHabit(uid,token,state.habits[index],id)        //add rollback if api write fails
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
            const index = state.habits.findIndex( habit => habit.id == id);                    
            updateHabit(uid,token,state.habits[index],id)                     
        }, 
        triggerCompleted: (state, action) => {
            id = action.payload.id;
            uid = action.payload.uid;           
            token = action.payload.token;
            const index = state.habits.findIndex( habit => habit.id == id);         
            today = action.payload.date;          
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
            const index = state.habits.findIndex( habit => habit.id == id);                    
            state.habits[index].is_active = !state.habits[index].is_active;                      
            updateHabit(uid,token,state.habits[index],id)                                           
        }, 

        initNotifDb: (state) => {                
                                                    
            state.notifDB = {};    
                                            
        }, 

        setDate: (state, action) => {                                          
            id = action.payload.id;
            date = action.payload.date;
            if(state.notifDB[id]==undefined) state.notifDB[id] = {ids:[],date:"2020-11-11"}; 
            state.notifDB[id].date = date;
        },  

        setNotifIds: (state, action) => {                                          
            id = action.payload.id;
            not_ids = action.payload.not_ids;
            if(state.notifDB[id]==undefined) state.notifDB[id] = {ids:[],date:"2020-11-11"};   //initialization date                      
            //state.notifDB[id].ids = not_ids;
            state.notifDB[id].ids=state.notifDB[id].ids.concat(not_ids);
            num_ids= state.notifDB[id].ids.length
            state.notifDB[id].date = getDate(); 
            console.log("NUMERO DI IDS PRIMA: "+num_ids+" NUMERO DI IDS ATTESI: "+action.payload.notify_num);
            if(num_ids>action.payload.notify_num)
            {
                for (var i=0;i<(num_ids-action.payload.notify_num);i++)
                    {
                        Notifications.cancelScheduledNotificationAsync(state.notifDB[id].ids[0]);
                        state.notifDB[id].ids.shift();
                    }
            }  
            console.log("ALLA FINE RESTANO "+state.notifDB[id].ids.length); 
        },        
        

    }
})

export const { setIsActive, setHabits, setRefreshing, incrementValue, decrementValue, triggerCompleted, initDay, setValue, pushValue, initNotifDb, setNotifIds, setDate} = habitSlice.actions;

export const selectHabits = (state) => state.hab.habits;
export const selectRefreshing = (state) => state.hab.refreshing;
export const selectNotifDB = (state) => state.hab.notifDB;


export default habitSlice.reducer;