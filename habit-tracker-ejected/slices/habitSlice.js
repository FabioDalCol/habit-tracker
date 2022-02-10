import { createSlice } from '@reduxjs/toolkit'
import getHabits, { updateHabit, updateHabitNoRetrieve, getDate, getTodayHabits, getOnlyHabit } from '../support/Api';
import * as Notifications from 'expo-notifications';
import { weekDays } from '../support/Api';
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
    notifDB: {},
    pedometerIsActive: false,
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

        setPedometer: (state, action) => {
            state.pedometerIsActive = action.payload;
        },

        incrementValue: (state, action) => {
            id = action.payload.id;
            uid = action.payload.uid;
            token = action.payload.token;
            today = action.payload.date;
            habits = JSON.parse(JSON.stringify(state.habits));
            const index = state.habits.findIndex(habit => habit.id == id);
            if (today == getDate()) {
                state.habits[index].value++;
                state.habits[index].stats[today].value = state.habits[index].value;
                if (state.habits[index].value >= state.habits[index].set_value) {    //if habit is completed add today (yyyy-mm--dd) to db                               
                    if (!state.habits[index].stats[today].completed) {
                        state.habits[index].stats[today].completed = true
                    }
                }
            }
            else {
                state.habits[index].stats[today].value++;
                if (state.habits[index].stats[today].value >= state.habits[index].stats[today].set_value) {    //if habit is completed add date (yyyy-mm--dd) to db                               
                    if (!state.habits[index].stats[today].completed) {
                        state.habits[index].stats[today].completed = true
                    }
                }
            }
        },

        decrementValue: (state, action) => {
            id = action.payload.id;
            uid = action.payload.uid;
            token = action.payload.token;
            today = action.payload.date;
            habits = JSON.parse(JSON.stringify(state.habits));
            const index = state.habits.findIndex(habit => habit.id == id);
            if (today == getDate()) {
                if (state.habits[index].value > 0) {
                    state.habits[index].value--;
                    state.habits[index].stats[today].value = state.habits[index].value;
                    if (state.habits[index].value < state.habits[index].set_value) {
                        if (state.habits[index].stats[today].completed) {
                            state.habits[index].stats[today].completed = false
                        }
                    }
                }
            }
            else {
                if (state.habits[index].stats[today].value > 0) {
                    state.habits[index].stats[today].value--;
                    if (state.habits[index].stats[today].value < state.habits[index].stats[today].set_value) {
                        if (state.habits[index].stats[today].completed) {
                            state.habits[index].stats[today].completed = false
                        }
                    }
                }
            }
        },

        setValue: (state, action) => {                                    //update with value selected habit
            id = action.payload.id;
            value = action.payload.value;
            today = action.payload.date;
            const index = state.habits.findIndex(habit => habit.id == id);
            if (today == getDate()) {
                state.habits[index].value = value;
                state.habits[index].stats[today].value = state.habits[index].value;
                if (state.habits[index].value < state.habits[index].set_value) {
                    if (state.habits[index].stats[today].completed) {
                        state.habits[index].stats[today].completed = false
                    }
                }
                else {
                    if (!state.habits[index].stats[today].completed) {
                        state.habits[index].stats[today].completed = true
                    }
                }
            }
            else {
                state.habits[index].stats[today].value = value;
                if (state.habits[index].stats[today].value < state.habits[index].stats[today].set_value) {
                    if (state.habits[index].stats[today].completed) {
                        state.habits[index].stats[today].completed = false
                    }
                }
                else {
                    if (!state.habits[index].stats[today].completed) {
                        state.habits[index].stats[today].completed = true
                    }
                }
            }
        },

        pushValue: (state, action) => {           //updates on db selected habit
            id = action.payload.id;
            uid = action.payload.uid;
            token = action.payload.token;
            habits = JSON.parse(JSON.stringify(state.habits));
            const index = state.habits.findIndex(habit => habit.id == id);
            updateHabit(uid, token, state.habits[index], id, habits)
        },

        triggerCompleted: (state, action) => {       //update completed state of uncountable habit
            id = action.payload.id;
            uid = action.payload.uid;
            token = action.payload.token;
            habits = JSON.parse(JSON.stringify(state.habits));
            const index = state.habits.findIndex(habit => habit.id == id);
            today = action.payload.date;
            state.habits[index].stats[today].completed = !state.habits[index].stats[today].completed;
            updateHabit(uid, token, state.habits[index], id, habits)
        },

        initDay: (state, action) => {            //initalize stats and new date of habits
            uid = action.payload.uid;
            token = action.payload.token;
            var today = getDate();
            var edited = false;
            for (var hab of state.habits) {
                const index = state.habits.findIndex(habit => habit.id == hab.id);
                if (state.habits[index].is_active) {
                    var first_date = [moment(today).add(-7, 'days'), moment(state.habits[index].created)].sort()[1]
                    var days = [];
                    for (var day of getDaysBetweenDates(first_date, moment(today))) {
                        if (state.habits[index].repeat_days[weekDays[new Date(day).getDay()]])
                            days.push(day);
                    }
                    if (state.habits[index].stats == undefined) state.habits[index].stats = {};
                    if (state.habits[index].countable) {
                        for (var day of days)
                            if (state.habits[index].stats[day] == undefined) {
                                state.habits[index].stats[day] = {}
                                state.habits[index].stats[day].set_value = state.habits[index].set_value
                                state.habits[index].stats[day].value = 0
                                state.habits[index].stats[day].completed = false
                                if (day == today)
                                    state.habits[index].value = 0;
                                edited = true;
                            }
                        if (edited)
                            updateHabit(uid, token, state.habits[index], hab.id);
                        edited = false;
                    }
                    else {
                        for (var day of days)
                            if (state.habits[index].stats[day] == undefined) {
                                state.habits[index].stats[day] = {}
                                state.habits[index].stats[day].completed = false
                                edited = true;
                            }
                        if (edited)
                            updateHabit(uid, token, state.habits[index], hab.id);
                        edited = false;
                    }
                }
            }
        },

        setIsActive: (state, action) => {   //trigger active or pause of selected habit
            id = action.payload.id;
            uid = action.payload.uid;
            token = action.payload.token;
            const index = state.habits.findIndex(habit => habit.id == id);
            state.habits[index].is_active = !state.habits[index].is_active;
            updateHabit(uid, token, state.habits[index], id)
        },

        initNotifDb: (state) => {      //initialize DB for scheduled notifications
            state.notifDB = {};
        },

        setDate: (state, action) => {  //update last refresh date of notifications DB
            id = action.payload.id;
            date = action.payload.date;
            if (state.notifDB[id] == undefined) state.notifDB[id] = { ids: [], date: "2020-11-11" };  //initialization date 
            state.notifDB[id].date = date;
        },

        setNotifIds: (state, action) => { //fill notification DB with notification ids
            id = action.payload.id;
            not_ids = action.payload.not_ids;
            if (state.notifDB[id] == undefined) state.notifDB[id] = { ids: [], date: "2020-11-11" };   //initialization date                
            state.notifDB[id].ids = state.notifDB[id].ids.concat(not_ids);
            num_ids = state.notifDB[id].ids.length
            state.notifDB[id].date = getDate();
            if (num_ids > action.payload.notify_num) {
                for (var i = 0; i < (num_ids - action.payload.notify_num); i++) {
                    Notifications.cancelScheduledNotificationAsync(state.notifDB[id].ids[0]);
                    state.notifDB[id].ids.shift();
                }
            }
        },
    }
})

export const { setIsActive, setHabits, setRefreshing, incrementValue, decrementValue, triggerCompleted, initDay, setValue, pushValue, initNotifDb, setNotifIds, setDate, setPedometer } = habitSlice.actions;

export const selectHabits = (state) => state.hab.habits;
export const selectRefreshing = (state) => state.hab.refreshing;
export const selectNotifDB = (state) => state.hab.notifDB;
export const selectPedometer = (state) => state.hab.pedometerIsActive;

export default habitSlice.reducer;