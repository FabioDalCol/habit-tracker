import React, { useState } from 'react'
import { View, Text} from 'react-native'
import DefaultHeader from '../components/DefaultHeader'
import DetailCalendar from '../components/DetailCalendar'
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
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import moment from 'moment'



const DetailScreen = ({route, navigation}) => {
    const id = route.params.id;
    const user = useSelector(selectUser);
    const uid = user.uid;
    const api_token = user.api_token;
    const habits= useSelector(selectHabits);
    const index = habits.findIndex( habit => habit.id == id);
    const habit=habits[index];
    const [date, setDate]= useState(getDate())
    console.log(habit);

    const getDaysBetweenDates = (startDate, endDate) => {
        var now = startDate.clone(), dates = [];
        while (now.isSameOrBefore(endDate)) {
            dates.push(now.format('YYYY-MM-DD'));
            now.add(1, 'days');
        }
        return dates
    };

    // const getRecapHabit= () => {                
    //     const month = moment(getDate()).month();      
    //     var total = [0,0];        
    //     if(habit.stats)    
    //         for(var date of Object.keys(habit.stats)){                
    //             if(moment(date).month()==month){
    //                 if(habit.countable){                        
    //                     total[0] = total[0] + parseInt(habit.stats[date].value); 
    //                     total[1] = total[1] + parseInt(habit.stats[date].set_value);                                             
    //                 }
    //                 else{
    //                     if(habit.stats[date].completed) total[0]++;
    //                     total[1]++;
    //                 }
    //             }
    //             }   
    //     console.log(total)    
    //     return total
    // }

    const getRecapHabit= () => {                
        const month = moment(getDate()).month();      
        var total = [0,0];        
        if(habit.stats){    
            for(var date of Object.keys(habit.stats)){                
                if(moment(date).month()==month){                    
                    if(habit.stats[date].completed) total[0]++;
                    total[1]++;
                }    
            }           
        return total
        }
    }

    const renderRecap = () => {
        const value = getRecapHabit()[0];
        const setValue = getRecapHabit()[1];        
        return <Text style={styles.detailRecap}>Monthly progress: {value}/{setValue}</Text>
    }

    
    return (<>
        <View>
            <DefaultHeader title="Detail"/>
        </View>
        <View style={{flex:1}}>
            <DetailCalendar habit={habit} datepicked={date} setDate={setDate} />  
            <ScrollView 
                style={styles.scrollView.manage}
                contentContainerStyle={{paddingBottom: 20}}>
                 {habit.stats[date] &&(<>
                {renderRecap()}
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
                /></>)}                       
            </ScrollView>  
        </View>
        </>
    )
}

export default DetailScreen
