import React, { useState } from 'react'
import { View, Text} from 'react-native'
import DefaultHeader from '../components/DefaultHeader'
import StatsCalendar from '../components/StatsCalendar'
import { useSelector } from 'react-redux';
import { selectHabits } from '../slices/habitSlice';
import { styles } from '../styles';
import { styleColors } from '../colors';
import {getDate} from '../Api'
import { Image } from 'react-native-elements';
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity, TextInput } from "react-native-gesture-handler";
import { selectUser } from "../slices/authSlice";
import moment from 'moment'
import tailwind from 'tailwind-rn';

export const getMonthlyRecap = (habits) => {
    const month = moment(getDate()).month()      
    var total = {}
    for(var habit of habits){
        for(var date of Object.keys(habit.stats)){                
            if(moment(date).month()==month){
                if(habit.countable){                        
                    if(total[habit.category] == undefined) total[habit.category]=0;
                    total[habit.category] = total[habit.category] + parseInt(habit.stats[date].value);                        
                }
                else{
                    if(total[habit.category] == undefined) total[habit.category]={}
                    if(total[habit.category][habit.name] == undefined) total[habit.category][habit.name]=0
                    total[habit.category][habit.name] ++;
                }
            }
        }
    }        
    return total
}


const RecapScreen = () => {

    const user = useSelector(selectUser);
    const uid = user.uid
    const api_token = user.api_token;
    const habits= useSelector(selectHabits);    

    const total = getMonthlyRecap(habits)
    const randomColor = () =>{ 
            var num = Math.floor(Math.random()*16777215).toString(16); 
            const color = "#" + num                           
            return color 
                                }
    
    return (<>
        <View>
            <DefaultHeader title="Monthly Recap"/>
        </View>
        <View style={{flex: 1}}>
        <View style={tailwind("flex-row pt-8")}>
            <Text style={[tailwind("text-4xl font-semibold pl-2 "),{color: styleColors.themeColor}]} >Good job, </Text>
            <Text style={[tailwind("text-4xl font-bold "),{color: styleColors.themeColor}]} >{user?.fullname?.split(/(\s+)/)[0]}</Text>
            <Text style={[tailwind("text-4xl font-semibold "),{color: styleColors.themeColor}]} >! </Text>            
        </View>
        <View >
            <Text style={tailwind("text-4xl font-semibold pt-8 pl-2")} >This month... </Text>
        </View>
        
            <View style={tailwind("flex-1 pt-8 ")}>
                {total.Walk && (            
                    <View style={tailwind("flex-row justify-center ")}>
                        <Image source={require("../images/man-running.png")} 
                            style={{ width: 40, height: 40 }}
                        />
                        <Text style={tailwind("text-xl")} > You've done </Text>
                        <Text style={[tailwind("text-xl font-bold"),{color: "brown"}]} >{total.Walk}</Text>
                        <Text style={tailwind("text-xl")} > steps</Text>
                    </View>
                )}
                {total.Drink && (
                <View style={tailwind("flex-row justify-center pt-4 ")}>
                    <Image source={require("../images/glass-of-water.png")} 
                            style={{ width: 30, height: 30 }}
                        />
                        <Text style={tailwind("text-xl")} > You drank </Text>
                        <Text style={[tailwind("text-xl font-bold "),{color: styleColors.water}]} >{total.Drink}</Text> 
                        <Text style={tailwind("text-xl")} > glasses of water</Text>     
                    </View>
                )}
                <View >
                    <Text style={tailwind("text-2xl font-semibold pt-8 pl-2")} >You also completed... </Text>
                </View>
                <View style={tailwind("justify-center ")}>
                {Object.keys(total.Custom).map(key => 
                    <View style={tailwind("flex-row justify-center pt-4 ")}>
                        <Text style={[tailwind("text-2xl font-bold"),{color: randomColor()}]}>{key}</Text>
                        <Text style={tailwind("text-2xl font-bold")}> {total.Custom[key]} </Text>
                        <Text style={tailwind("text-2xl")}>times</Text>
                    </View>
                )}
                </View>
            </View>            
        </View>
        </>)
}

export default RecapScreen
