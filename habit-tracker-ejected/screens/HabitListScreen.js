import React, { useState } from 'react'
import { View, Text, RefreshControl } from 'react-native'
import DefaultHeader from '../components/DefaultHeader'
import { ScrollView } from "react-native-gesture-handler";
import Habit from '../components/Habit';
import { styles } from '../styles';
import getHabits from '../support/Api';

//REDUX
import { useSelector } from 'react-redux'
import { selectHabits } from '../slices/habitSlice'
import { selectUser } from '../slices/authSlice';

const HabitListScreen = () => {


    const habitList = useSelector(selectHabits);
    const user = useSelector(selectUser);

    const uid = user.uid
    const api_token = user.api_token;

    const [refreshing, setRefreshing] = useState(false); //pull down to refresh 
    const [habitToEdit, setHabitToEdit] = useState('');

    return (
        <View style={{ flex: 1 }}>
            <DefaultHeader title="Manage Habits" />
            <ScrollView
                style={styles.scrollView.manage}
                contentContainerStyle={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            getHabits(uid, api_token, habitList, setRefreshing)
                        }
                        } />}
            >
                {habitList.map(habit =>
                    <Habit
                        key={habit.id}
                        id={habit.id}
                        name={habit.name}
                        category={habit.category}
                        desc={habit.desc}
                        countable={habit.countable}
                        value={habit.value}
                        set_value={habit.set_value}
                        manage_habits={true}
                        is_active={habit.is_active}
                        created={habit.created}
                        show={habit.id == habitToEdit}
                        habitToEdit={habitToEdit}
                        setHabitToEdit={setHabitToEdit}
                        times={habit.reminder}
                        reminder={habit.reminder > 0}
                        mon={habit.repeat_days.Mon}
                        tue={habit.repeat_days.Tue}
                        wed={habit.repeat_days.Wed}
                        thu={habit.repeat_days.Thu}
                        fri={habit.repeat_days.Fri}
                        sat={habit.repeat_days.Sat}
                        sun={habit.repeat_days.Sun}
                        pedometer={habit.pedometer}
                    />
                )}
            </ScrollView>
        </View>
    )
}

export default HabitListScreen
