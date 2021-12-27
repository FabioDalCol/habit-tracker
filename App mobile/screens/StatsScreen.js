import React, { useState } from 'react'
import { View, Text} from 'react-native'
import DefaultHeader from '../components/DefaultHeader'
import StatsCalendar from '../components/StatsCalendar'
import { useSelector } from 'react-redux';
import { selectHabits } from '../slices/habitSlice';
import { styles } from '../styles';
import { styleColors } from '../colors';
import {getDate} from '../Api'
import Habit from "../components/Habit";
import { weekDays } from "../Api";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity, TextInput } from "react-native-gesture-handler";
import { selectUser } from "../slices/authSlice";
import tailwind from "tailwind-rn";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout } from "../hooks/useAuth";
import getHabits, { countCompletedHabits } from "../Api";
import store from "../store";
import {decrementValue, incrementValue, triggerCompleted, initDay, setValue  } from "../slices/habitSlice";
import { colors } from "react-native-elements";
import HomeHeader from "../components/HomeHeader";



const StatsScreen = () => {

    const user = useSelector(selectUser);
    const uid = user.uid
    const api_token = user.api_token;
    const habits= useSelector(selectHabits);
    const [date, setDate]= useState(getDate())

    const getHabitsFromDate = (date) =>
    {
        var ids = []   
        if(habits == null ) return ids
        for(var habit of habits){ 
            if(habit.stats)        
            {    
                if (habit.stats[date]){        //If today weekday is true
                    ids.push(habit.id)
                }
            }      
        }  
        return ids
    }

    return (<>
        <View>
            <DefaultHeader title="Stats"/>
        </View>
        <View>
            <StatsCalendar habits={habits} datepicked={date} setDate={setDate} />
            <ScrollView 
                style={styles.scrollView.manage}
                contentContainerStyle={{paddingBottom: 20}}>

                {habits?.map(habit => 
                (getHabitsFromDate(date)?.includes(habit.id) && (
                <Habit
                    key={habit.id} 
                    id = {habit.id}             
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
                />
                )        
                )
                )}
            </ScrollView>  
        </View>
        </>
    )
}

export default StatsScreen
