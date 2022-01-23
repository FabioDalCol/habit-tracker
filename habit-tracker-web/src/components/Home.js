import React from 'react';
import { useEffect, useState } from 'react';
import { useFirstRender } from '../hooks/useFirstRender';
import { useSelector } from "react-redux";
import { selectUser, selectProfile } from "../slices/authSlice";
import { selectHabits } from '../slices/habitSlice';
import { logout } from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import getHabits, { getTodayHabits, getDate, getHabitsFromDate, weekDays, countCompletedHabits } from '../Api';
import * as Mui from '@mui/material';
import CustomDatePicker from './CustomDatePicker'
import moment from 'moment'
import HabitForm from './HabitForm';
import store from '../store';
import 'bootstrap/dist/css/bootstrap.min.css';
import { initDay, pushValue } from '../slices/habitSlice';
import { Habit } from './Habit'
import { styles } from "../styles";
import { Toaster } from 'react-hot-toast';


const useDebouncedEffect = (effect, deps, delay) => {      //debounce custom hook
    useEffect(() => {
        const handler = setTimeout(() => effect(), delay);
        return () => clearTimeout(handler);
    }, [...(deps || []), delay]);
};


const Home = () => {
    let navigate = useNavigate();
    const user = useSelector(selectUser);
    const profile = useSelector(selectProfile);
    const habits = useSelector(selectHabits)
    const uid = user.uid
    const api_token = user.api_token;
    const [date, setDate] = useState(getDate());
    const [debounce, setDebounce] = useState(0);
    const firstRender = useFirstRender();

    //Get the habits for today (mon,tue,wed,...)
    var todayHabits = getTodayHabits(habits);

    //Count the completed habits today
    var completedHabitsCount = countCompletedHabits(todayHabits, habits);

    //Return a color based on the percentage of daily progress
    const dailyProgressColor = () => {
        if (completedHabitsCount / todayHabits.length <= 1 / 2) {
            return "bg-danger"
        }
        if (completedHabitsCount / todayHabits.length < 1) {
            return "bg-warning"
        }
        else {
            return "bg-success"
        }
    }

    //Get the creation date of the first habit created
    const getFirstDate = (habits) => {
        if (habits == null) {
            return getDate()
        }
        var dates = [];
        for (var habit of habits) {
            dates.push(habit.created)
        }
        return dates.sort()[0]
    }

    //Return a string with all the active days
    const repeatDays = (activeDays) => {
        var days = ""
        for (var day of weekDays) {
            if (activeDays[day]) {
                days = days + day + ", "
            }
        }
        days = days.slice(0, -2);
        return days
    }

    //Count the completed habits at the passed date
    const countCompleteFromDate = (date) => {
        var completed = 0;
        var total = 0;
        if (habits == null) return undefined;
        for (var habit of habits) {
            if (habit.stats) {
                if (habit.stats[date]) {        //If today weekday is true
                    total = total + 1;
                    completed = completed + habit.stats[date].completed;
                }
            }
        }
        return (total ? completed / total : undefined);
    }

    //Create an array that contains all the date between two date (es. startDate=2022-01-01, endDate=2022-01-03, it will return [2022-01-01, 2022-01-02, 2022-01-03])
    const getDaysBetweenDates = (startDate, endDate) => {
        var now = startDate.clone(), dates = [];
        while (now.isSameOrBefore(endDate)) {
            dates.push(now.format('YYYY-MM-DD'));
            now.add(1, 'days');
        }
        return dates
    };

    //Create 3 array of dates based on daily progress for date
    const markDay = () => {
        let dates = getDaysBetweenDates(moment(getFirstDate(habits)), new Date());
        var red = []
        var yellow = []
        var green = []
        for (var k of dates) {
            let progress = countCompleteFromDate(k);
            if (progress == undefined) continue;
            if (progress < 0.5)
                red.push(k);
            else {
                if (progress < 1)
                    yellow.push(k)
                else
                    green.push(k);
            }
        }

        const x = [red, yellow, green]
        return x;
    }

    var red = []
    var yellow = []
    var green = []

    red = markDay()[0];
    yellow = markDay()[1];
    green = markDay()[2];


    useEffect(() => {
        getHabits(uid, api_token, {})
    }, [])

    useEffect(() => {
        if (habits != undefined && !firstRender) {
            store.dispatch(initDay({ uid: uid, token: api_token }))
        }
    }, [habits, firstRender])

    //Push just when there aren't action since 1 sec (it greatly decreases calls to apis)
    useDebouncedEffect(() => { if (debounce.id != undefined) store.dispatch(pushValue({ id: debounce.id, uid: uid, token: api_token })) }, [debounce], 1000); //debounce updates to limit api calls

    return (<>
        <div className="bar">
            <div className="header">
                <h1>Hi, {profile.username}</h1>
            </div>
            <Mui.Button style={styles.headerIcons} onClick={() => { logout(); navigate('/') }}>Sign out</Mui.Button>
            <Mui.Button style={styles.headerIcons} onClick={() => { navigate('/editprofile') }}>Profile</Mui.Button>
        </div>
        <div className='full-box'>
            <div className="left-box">
                <div className='titlesx'>
                    <p> New Habit </p>
                </div>
                <HabitForm uid={uid} token={api_token} />
            </div>


            <div className="center-box">
                <Toaster />
                <div style={styles.flexCenter}>
                    <h3 className="hovButton" onClick={() => getHabits(uid, api_token, {})}> Daily progress </h3>
                </div>
                <div className="progress position-relative" style={styles.progressBar}>
                    <div className={"progress-bar " + dailyProgressColor()} role="progressbar" style={{ width: completedHabitsCount / todayHabits.length * 100 + "%" }} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                    <h6 className="justify-content-center d-flex position-absolute w-100 mt-1 ">{completedHabitsCount} of {todayHabits.length}</h6>
                </div>
                {habits?.map(habit =>
                (todayHabits?.includes(habit.id) && (
                    <Habit
                        key={habit.id}
                        id={habit.id}
                        name={habit.name}
                        category={habit.category}
                        desc={(repeatDays(habit.repeat_days).split(',').length > 6) ? 'Everyday' : repeatDays(habit.repeat_days)}
                        countable={habit.countable}
                        value={habit.value}
                        set_value={habit.set_value}
                        completeToday={habit.stats != undefined ? habit.stats[getDate()]?.completed : false}
                        date={getDate()}
                        setDebounce={setDebounce}
                        debounce={debounce}
                    />
                )
                )
                )}
            </div>
            <div className="right-box" >
                <div className='titledx'>
                    <p> History stats </p>
                </div>
                <div className="static-picker">
                    <CustomDatePicker red={red} yellow={yellow} green={green} first={getFirstDate(habits)} setDateHome={setDate} />
                </div>
                <p className='habitsdate'>Habits for {moment(date).format('YYYY-MM-DD')}</p>
                <div style={styles.flexCenter}>
                    <div style={{ width: "80%" }}>
                        {habits?.map(habit =>
                        (getHabitsFromDate(habits, date)?.includes(habit.id) && (
                            <Habit
                                key={habit.id}
                                id={habit.id}
                                name={habit.name}
                                category={habit.category}
                                desc={habit.desc}
                                countable={habit.countable}
                                value={habit.stats[moment(date).format("YYYY-MM-DD")].value}
                                set_value={habit.stats[moment(date).format("YYYY-MM-DD")].set_value}
                                completeToday={habit.stats != undefined ? habit.stats[moment(date).format("YYYY-MM-DD")]?.completed : false}
                                uid={uid}
                                api_token={api_token}
                                date={moment(date).format("YYYY-MM-DD")}
                                debounce={debounce}
                                setDebounce={setDebounce}
                            />
                        )
                        )
                        )}

                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Home;