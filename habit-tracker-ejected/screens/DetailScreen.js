import React, { useState, useRef } from 'react'
import { View, Text } from 'react-native'
import { ScrollView } from "react-native-gesture-handler";
import { styles } from '../styles';
import { styleColors } from '../colors';
import DefaultHeader from '../components/DefaultHeader'
import DetailCalendar from '../components/DetailCalendar'
import Habit from "../components/Habit";
import { useSelector } from 'react-redux';
import { selectHabits, pushValue } from '../slices/habitSlice';
import { selectUser } from "../slices/authSlice";
import { getDate } from '../support/Api'
import moment from 'moment'
import ViewShot from "react-native-view-shot";
import store from '../store';
import { useDebouncedEffect } from './HomeScreen';

const DetailScreen = ({ route }) => {
    const viewShot = useRef();
    const id = route.params.id;
    const user = useSelector(selectUser);
    const uid = user.uid;
    const api_token = user.api_token;
    const habits = useSelector(selectHabits);
    const index = habits.findIndex(habit => habit.id == id);
    const habit = habits[index];
    const [date, setDate] = useState(getDate())
    const [month, setMonth] = useState(moment(getDate()).month())
    const [debounce, setDebounce] = useState(0);

    const getRecapHabit = (date) => {           //gets montly total for each completed habit category
        var monthCurrent = String(moment(date).format('MMMM'))
        var total = [0, 0, monthCurrent];
        if (habit.stats) {
            for (var date of Object.keys(habit.stats)) {
                if (moment(date).month() == month) {
                    if (habit.stats[date].completed) total[0]++;
                    total[1]++;
                }
            }
            return total
        }
    }

    const getWeeklyRecapHabit = (date) => {           //gets weekly total for each completed habit category
        var startOfWeek = moment(date).startOf('isoweek')
        var endOfWeek = moment(date).endOf('isoweek')
        var week = startOfWeek.format("DD/MM") + "-" + endOfWeek.format("DD/MM")
        var total = [0, 0, week];
        if (habit.stats) {
            for (var date of Object.keys(habit.stats)) {
                if (moment(date) >= startOfWeek && moment(date) <= endOfWeek) {
                    if (habit.stats[date].completed) total[0]++;
                    total[1]++;
                }
            }
            return total
        }
    }

    const renderRecap = () => {
        const value = getRecapHabit(date);
        const valueWeek = getWeeklyRecapHabit(date);
        return (
            <View>
                <Text style={[styles.detailRecap, { marginBottom: "1%" }]}>Monthly progress ({value[2]}): {value[0]}/{value[1]}</Text>
                <Text style={styles.detailRecap}>Weekly progress ({valueWeek[2]}): {valueWeek[0]}/{valueWeek[1]}</Text>
            </View>
        )
    }

    useDebouncedEffect(() => { if (debounce.id != undefined) store.dispatch(pushValue({ id: debounce.id, uid: uid, token: api_token })) }, [debounce], 1000);

    return (<>
        <ViewShot ref={viewShot} style={{ flex: 1, backgroundColor: styleColors.background }} options={{ format: "png", quality: 1 }}>
            <View>
                <DefaultHeader title="Detail" monthly_recap={true} viewShot={viewShot} />
            </View>
            <View style={{ flex: 1 }}>
                <DetailCalendar habit={habit} datepicked={date} setDate={setDate} setMonth={setMonth} />
                <ScrollView
                    style={styles.scrollView.manage}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}>
                    {habit.stats[date] && (<>
                        {renderRecap()}
                        <Habit
                            key={habit.id}
                            id={habit.id}
                            name={habit.name}
                            category={habit.category}
                            desc={habit.desc}
                            countable={habit.countable}
                            value={habit.stats[date].value}
                            set_value={habit.stats[date].set_value}
                            completeToday={habit.stats != undefined ? habit.stats[date]?.completed : false}
                            uid={uid}
                            api_token={api_token}
                            date={date}
                            debounce={debounce}
                            setDebounce={setDebounce}
                        /></>)}
                </ScrollView>
            </View>
        </ViewShot>
    </>
    )
}

export default DetailScreen
