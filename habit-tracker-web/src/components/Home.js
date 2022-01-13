import React from 'react';
import { useEffect, useState } from 'react';
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
import { initDay } from '../slices/habitSlice';
import { Habit } from './Habit'


const Home = () => {
    let navigate = useNavigate();
    const user = useSelector(selectUser);
    const profile = useSelector(selectProfile);
    const habits = useSelector(selectHabits)
    const uid = user.uid
    const api_token = user.api_token;
    const [date, setDate] = useState(getDate());

    var todayHabits = getTodayHabits(habits);
    var completedHabitsCount = countCompletedHabits(todayHabits, habits);

    const dailyProgressColor = () => {
        var percent = completedHabitsCount / todayHabits.length * 100 + "%"
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

    const getDaysBetweenDates = (startDate, endDate) => {
        var now = startDate.clone(), dates = [];
        while (now.isSameOrBefore(endDate)) {
            dates.push(now.format('YYYY-MM-DD'));
            now.add(1, 'days');
        }
        return dates
    };

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
        if (habits != undefined) {
            store.dispatch(initDay({ uid: uid, token: api_token }))
        }

    }, [habits])


    return (<>
        <div className="bar">
            <div className="header">
                <h1>Hi, {profile.username}</h1>
            </div>
            <Mui.Button style={{ marginTop: -15, marginLeft: -5 }} onClick={() => { logout(); navigate('/') }}>Sign out</Mui.Button>
            <Mui.Button style={{ marginTop: -15, marginLeft: -5 }} onClick={() => { navigate('/editprofile') }}>Profile</Mui.Button>
        </div>
        <div className='full-box'>
            <div className="left-box">
                <div className='titlesx'>
                    <p> New Habit </p>
                </div>
                <HabitForm uid={uid} token={api_token} />
            </div>


            <div className="center-box">
                <div style={{ justifyContent: 'center', display: 'flex' }}>
                    <h3> Daily progress </h3>
                </div>
                <div className="progress position-relative" style={{ height: 25, marginBottom: 20 }}>
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
                <p style={{textAlign:'center', fontWeight:600, fontSize:22, marginTop: -30, color: '#20377a'}}>Habits for {moment(date).format('YYYY-MM-DD')}</p>
                <div style={{ display: "flex", justifyContent: "center" }}>
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