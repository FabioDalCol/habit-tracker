import axios from 'axios';
import store from './store';
import { setHabits } from './slices/habitSlice';
import { setProfile, setToken } from './slices/authSlice';
import { generate_api_token } from './hooks/useAuth'
import moment from 'moment'

export const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

var retry = true;

const baseUrl = `https://habits-app-api.ew.r.appspot.com/api/v1/users/`;

const getHabits = async (uid, token, old, setRefreshing) => {
    const url = baseUrl + uid + '/habits/'
    await axios.get(url, { headers: { token: token } })
        .then(async (response) => {
            let push = false;
            if (Object.keys(old).length > 0) {
                for (let id of walkToday(old)) {
                    if (getOnlyHabit(response.data, id) != undefined) {
                        if (getOnlyHabit(old, id).value != getOnlyHabit(response.data, id).value) {
                            updateHabitNoRetrieve(uid, token, getOnlyHabit(old, id), id)
                            push = true
                        }
                    }
                }
                if (push) {
                    getHabits(uid, token, {})
                }
            }
            else {
                if (JSON.stringify(old) != JSON.stringify(response.data)) {
                    store.dispatch(setHabits(response.data));
                }
            }
            retry = true
        })
        .catch(async (error) => {
            alert(error.message);
            //error 401
            var code = error.message.split(' ')
            if (code.pop() == 401 && retry) {
                await generate_api_token("empty token", "1970-01-01", uid)
                    .then((tok) => { store.dispatch(setToken(tok)); retry = false; getHabits(uid, tok, old, setRefreshing) })
            }
        })
        .finally(() => { if (setRefreshing != undefined) setRefreshing(false); });
};

const updateHabit = async (uid, token, habit, id, habits = {}) => {
    const url = baseUrl + uid + '/habits/' + id;
    await axios.put(url, habit, { headers: { token: token, 'Content-Type': 'application/json' } })
        .catch(error => { alert(error.message) })
        .finally(() => getHabits(uid, token, habits));
};

const updateHabitNoRetrieve = (uid, token, habit, id) => {
    const url = baseUrl + uid + '/habits/' + id;
    axios.put(url, habit, { headers: { token: token, 'Content-Type': 'application/json' } })
        .catch(error => { alert(error.message) })
};

const addHabit = async (uid, token, habit, habits = {}) => {
    const url = baseUrl + uid + '/habits/';
    await axios.post(url, habit, { headers: { token: token, 'Content-Type': 'application/json' } })
        .catch(error => { alert(error.message) })
        .finally(() => getHabits(uid, token, habits));
};

const removeHabit = async (uid, token, id) => {
    const url = baseUrl + uid + '/habits/' + id
    await axios.delete(url, { headers: { token: token } })
        .catch(error => { alert(error.message) })
        .finally(() =>
            getHabits(uid, token, {})
        )
};

const getDate = () => {
    let today = new Date()
    return today.toISOString().split('T')[0]
}

const getOnlyHabit = (habits, id) => {
    const index = habits.findIndex(habit => habit.id == id);
    return habits[index]
}

const getTodayHabits = (habits) => {
    let today = new Date()
    var ids = []
    if (habits == null) return ids
    for (var habit of habits) {
        if (habit.repeat_days[weekDays[today.getDay()]] && habit.is_active) {        //If today weekday is true
            ids.push(habit.id)
        }
    }
    return ids
}

const walkToday = (habits) => {
    var ids = []
    for (let id of getTodayHabits(habits)) {
        if (getOnlyHabit(habits, id).category == "Walk") {
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

const getProfile = async (uid, token, old) => {
    const url = baseUrl + uid;
    await axios.get(url, { headers: { token: token } })
        .then((response) => {
            if (JSON.stringify(old) != JSON.stringify(response.data)) {
                store.dispatch(setProfile(response.data));
            }
            return true
        })
        .catch(error => {
            var code = error.message.split(' ')
            if (code.pop() == 404)
                return false;
        });
};

const updateUserProfile = async (uid, token, profile) => {
    const url = baseUrl + uid;
    await axios.put(url, profile, { headers: { token: token, 'Content-Type': 'application/json' } })
        .catch(error => { alert(error.message) });

};

const createUserProfile = async (uid, token) => {
    const url = baseUrl + uid;
    var profile = {
        username: "null",
        height: 0,
        age: 0,
        rise_time: "00:00",
        sleep_time: "00:00",
    }
    await axios.post(url, profile, { headers: { token: token, 'Content-Type': 'application/json' } })
        .catch(error => { alert(error.message) });

};

const getHabitsFromDate = (habits, date) => {
    date = moment(date).format("YYYY-MM-DD")
    var ids = []
    if (habits == null) return ids
    for (var habit of habits) {
        if (habit.stats) {
            if (habit.stats[date]) {        //If today weekday is true
                ids.push(habit.id)
            }
        }
    }
    return ids
}





export default getHabits
export { getHabitsFromDate, updateHabit, getDate, addHabit, removeHabit, getTodayHabits, countCompletedHabits, updateUserProfile, getProfile, createUserProfile, getOnlyHabit, walkToday, updateHabitNoRetrieve }