import React, { useState, useRef } from 'react'
import { View } from 'react-native'
import { ScrollView } from "react-native-gesture-handler";
import DefaultHeader from '../components/DefaultHeader'
import StatsCalendar from '../components/StatsCalendar'
import Habit from "../components/Habit";
import { styles } from '../styles';
import { styleColors } from '../colors';
import { useSelector } from 'react-redux';
import { selectHabits, pushValue } from '../slices/habitSlice';
import { selectUser } from "../slices/authSlice";
import { getDate } from '../support/Api'
import { useDebouncedEffect } from '../screens/HomeScreen';
import store from '../store';
import ViewShot from "react-native-view-shot";

const StatsScreen = () => {

    const user = useSelector(selectUser);
    const uid = user.uid
    const api_token = user.api_token;
    const habits = useSelector(selectHabits);
    const [date, setDate] = useState(getDate())
    const viewShot = useRef();
    const [debounce, setDebounce] = useState(0);

    const getHabitsFromDate = (date) => {
        var ids = []
        if (habits == null) return ids
        for (var habit of habits) {
            if (habit.stats) {
                if (habit.stats[date]) {        //if date weekday is true push to ids array
                    ids.push(habit.id)
                }
            }
        }
        return ids
    }

    useDebouncedEffect(() => { if (debounce.id != undefined) store.dispatch(pushValue({ id: debounce.id, uid: uid, token: api_token })) }, [debounce], 1000);

    return (<>
        <ViewShot ref={viewShot} style={{ flex: 1, backgroundColor: styleColors.background }} options={{ format: "png", quality: 1 }}>
            <View>
                <DefaultHeader title="Stats" recap={true} viewShot={viewShot} />
            </View>
            <View style={{ flex: 1 }}>
                <StatsCalendar habits={habits} datepicked={date} setDate={setDate} />
                <ScrollView
                    style={styles.scrollView.manage}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}>
                    {habits?.map(habit =>
                    (getHabitsFromDate(date)?.includes(habit.id) && (
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
                        />
                    )
                    )
                    )}
                </ScrollView>
            </View>
        </ViewShot>
    </>
    )
}

export default StatsScreen
