import axios from 'axios';
import store from '../store';
import { ToastAndroid } from 'react-native';
import { setHabits } from '../slices/habitSlice';
import { setProfile, setToken } from '../slices/authSlice';
import { generate_api_token } from './useAuth'

export const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

var retry = true;

const baseUrl = `https://habits-app-api.ew.r.appspot.com/api/v1/users/`;

const getHabits = async (uid, token, old, setRefreshing) => {  //retrieve habits 
    const url = baseUrl + uid + '/habits/'
    await axios.get(url, { headers: { token: token } }, { timeout: 3000 })
        .then(async (response) => {
            if (Object.keys(old).length > 0) {
                let resp_habits = JSON.parse(JSON.stringify(response.data));
                for (id of walkToday(old)) {      //push local steps count before pulling new habits data
                    if (getOnlyHabit(response.data, id) != undefined) {
                        if (getOnlyHabit(old, id).value != getOnlyHabit(response.data, id).value) {
                            updateHabitNoRetrieve(uid, token, getOnlyHabit(old, id), id)
                            const index = resp_habits.findIndex(habit => habit.id == id);
                            resp_habits[index] = getOnlyHabit(old, id)
                        }
                    }
                }
                store.dispatch(setHabits(resp_habits));
            }
            else {
                if (JSON.stringify(old) != JSON.stringify(response.data)) {
                    store.dispatch(setHabits(response.data));
                }
            }
            retry = true
        })
        .catch(async (error) => {
            if (error.message == "Network Error") {
                ToastAndroid.show("Network Error. Please check connection", ToastAndroid.SHORT);
            }
            else {
                if (!retry) alert(error.message);
                //error 401
                var code = error.response.status
                if (code == 401 && retry) {     //if get fails retry generating a new token          
                    await generate_api_token(uid, token)
                        .then((tok) => { store.dispatch(setToken(tok)); retry = false; getHabits(uid, tok, old, setRefreshing) })
                }
            }
        })
        .finally(() => { if (setRefreshing != undefined) setRefreshing(false); });
};

const updateHabit = async (uid, token, habit, id, habits = {}) => {
    const url = baseUrl + uid + '/habits/' + id;
    await axios.put(url, habit, { headers: { token: token, 'Content-Type': 'application/json' } }, { timeout: 3000 })
        .catch(error => { ToastAndroid.show(error.message, ToastAndroid.SHORT); })
        .finally(() => getHabits(uid, token, habits));
};

const updateHabitNoRetrieve = (uid, token, habit, id) => {
    const url = baseUrl + uid + '/habits/' + id;
    axios.put(url, habit, { headers: { token: token, 'Content-Type': 'application/json' } }, { timeout: 3000 })
        .catch(error => { ToastAndroid.show(error.message, ToastAndroid.SHORT); })
};

const addHabit = async (uid, token, habit, habits = {}) => {
    const url = baseUrl + uid + '/habits/';
    await axios.post(url, habit, { headers: { token: token, 'Content-Type': 'application/json' } }, { timeout: 3000 })
        .catch(error => { ToastAndroid.show(error.message, ToastAndroid.SHORT); })
        .finally(() => getHabits(uid, token, habits));
};

const removeHabit = async (uid, token, id) => {
    const url = baseUrl + uid + '/habits/' + id
    await axios.delete(url, { headers: { token: token } }, { timeout: 3000 })
        .catch(error => { ToastAndroid.show(error.message, ToastAndroid.SHORT); })
        .finally(() =>
            getHabits(uid, token, {})
        )
};

const getDate = () => {
    let today = new Date()
    return today.toISOString().split('T')[0]
}

const getOnlyHabit = (habits, id) => {   //return habit passing habits and id
    const index = habits.findIndex(habit => habit.id == id);
    return habits[index]
}

const getTodayHabits = (habits) => {  //get habits active for today
    today = new Date()
    var ids = []
    if (habits == null) return ids
    for (var habit of habits) {
        if (habit.repeat_days[weekDays[today.getDay()]] && habit.is_active) {        //If today weekday is true
            ids.push(habit.id)
        }
    }
    return ids
}

const walkToday = (habits) => {   //get "walk" category habits active today
    var ids = []
    for (id of getTodayHabits(habits)) {
        if (getOnlyHabit(habits, id).category == "Walk") {
            ids.push(id)
        }
    }
    return ids
}

const walkTodayPed = (habits) => {
    var ids = []
    for (id of getTodayHabits(habits)) {
        if (getOnlyHabit(habits, id).category == "Walk" && getOnlyHabit(habits, id).pedometer) {
            ids.push(id)
        }
    }
    return ids
}

const countCompletedHabits = (habIds, habits) => {
    var completed = 0;
    var today = getDate();
    for (var id of habIds) {
        const index = habits.findIndex(habit => habit.id == id);
        if (habits[index].stats != undefined)
            if (habits[index].stats[today]?.completed) {
                completed++;
            }
    }
    return completed;
}

const getProfile = async (uid, token) => {
    const url = baseUrl + uid;
    await axios.get(url, { headers: { token: token } }, { timeout: 3000 })
        .then((response) => {
            store.dispatch(setProfile(response.data));
        })
        .catch(error => { ToastAndroid.show(error.message, ToastAndroid.SHORT); });
};

const updateUserProfile = async (uid, token, profile) => {
    const url = baseUrl + uid;
    await axios.put(url, profile, { headers: { token: token, 'Content-Type': 'application/json' } }, { timeout: 3000 })
        .catch(error => { ToastAndroid.show(error.message, ToastAndroid.SHORT); })
};

const createUserProfile = async (uid, token) => {
    const url = baseUrl + uid;
    profile = {
        username: "null",
        height: 0,
        age: 0,
        rise_time: "00:00",
        sleep_time: "00:00",
    }
    await axios.post(url, profile, { headers: { token: token, 'Content-Type': 'application/json' } }, { timeout: 3000 })
        .catch(error => { ToastAndroid.show(error.message, ToastAndroid.SHORT); })

};

export default getHabits
export { updateHabit, getDate, addHabit, removeHabit, getTodayHabits, countCompletedHabits, updateUserProfile, getProfile, createUserProfile, getOnlyHabit, walkToday, updateHabitNoRetrieve, walkTodayPed }