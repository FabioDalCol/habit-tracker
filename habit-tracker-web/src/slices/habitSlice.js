import { createSlice } from '@reduxjs/toolkit'
import getHabits, { weekDays, updateHabit, updateHabitNoRetrieve, getDate, getTodayHabits, getOnlyHabit } from '../Api';
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
            let id = action.payload.id;
            let today = action.payload.date;
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
                if (state.habits[index].stats[today].value >= state.habits[index].stats[today].set_value) {    //if habit is completed add today (yyyy-mm--dd) to db                               
                    if (!state.habits[index].stats[today].completed) {
                        state.habits[index].stats[today].completed = true
                    }
                }
            }
        },
        decrementValue: (state, action) => {
            let id = action.payload.id;
            let uid = action.payload.uid;
            let token = action.payload.token;
            let today = action.payload.date;
            let habits = JSON.parse(JSON.stringify(state.habits));
            const index = state.habits.findIndex(habit => habit.id == id);
            if (today == getDate()) {
                if (state.habits[index].value > 0) {
                    state.habits[index].value--;
                    state.habits[index].stats[today].value = state.habits[index].value;
                    if (state.habits[index].value < state.habits[index].set_value) {       //if Habit isn't completed removes it from the db for today                                 
                        if (state.habits[index].stats[today].completed) {
                            state.habits[index].stats[today].completed = false
                        }
                    }
                }
            }
            else {
                if (state.habits[index].stats[today].value > 0) {
                    state.habits[index].stats[today].value--;
                    if (state.habits[index].stats[today].value < state.habits[index].stats[today].set_value) {       //if Habit isn't completed removes it from the db for today                                 
                        if (state.habits[index].stats[today].completed) {
                            state.habits[index].stats[today].completed = false
                        }
                    }
                }
            }
        },
        setValue: (state, action) => {                                          //set without calling API update
            let id = action.payload.id;
            let value = action.payload.value;
            let today = action.payload.date;
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
        pushValue: (state, action) => {
            let id = action.payload.id;
            let uid = action.payload.uid;
            let token = action.payload.token;
            let habits = JSON.parse(JSON.stringify(state.habits));
            const index = state.habits.findIndex(habit => habit.id == id);
            updateHabit(uid, token, state.habits[index], id, habits)
        },
        triggerCompleted: (state, action) => {
            let id = action.payload.id;
            let uid = action.payload.uid;
            let token = action.payload.token;
            let habits = JSON.parse(JSON.stringify(state.habits));
            const index = state.habits.findIndex(habit => habit.id == id);
            let today = action.payload.date;
            state.habits[index].stats[today].completed = !state.habits[index].stats[today].completed;
            updateHabit(uid, token, state.habits[index], id, habits)
        },
        initDay: (state, action) => {            //initalize stats and new date of habits
            let uid = action.payload.uid;
            let token = action.payload.token;
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
        setIsActive: (state, action) => {
            let id = action.payload.id;
            let uid = action.payload.uid;
            let token = action.payload.token;
            const index = state.habits.findIndex(habit => habit.id == id);
            state.habits[index].is_active = !state.habits[index].is_active;
            updateHabit(uid, token, state.habits[index], id)
        },






    }
})

export const { incrementValueNoUpdate, setIsActive, setHabits, setRefreshing, incrementValue, decrementValue, triggerCompleted, initDay, setValue, pushValue, } = habitSlice.actions;

export const selectHabits = (state) => state.hab.habits;
export const selectRefreshing = (state) => state.hab.refreshing;

export default habitSlice.reducer;