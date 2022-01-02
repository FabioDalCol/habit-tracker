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
import { selectUser, selectProfile } from "../slices/authSlice";
import moment from 'moment'
import tailwind from 'tailwind-rn';

export const getMonthlyRecap = (habits) => {
    const month = moment(getDate()).month()      
    var total = {}
    for(var habit of habits){
        if(habit.stats)    
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
    const profile = useSelector(selectProfile);
    const total = getMonthlyRecap(habits)
    const randomColor = () =>{ 
        return styleColors.custom[Math.floor(Math.random()*styleColors.custom.length)]
    }
    console.log(total)
    return (<>
        <View>
            <DefaultHeader title="Monthly Recap"/>
        </View>
        <View style={{flex: 1}}>
        <View style={tailwind("flex-row pt-8 pl-2")}>
            <Image source={require("../images/rocket.png")} 
                            style={{ width: 48, height: 48 }}
                        />
            <View style={tailwind("flex-row  self-center")}>
                <Text style={[tailwind("text-4xl font-semibold pl-2 "),{color: styleColors.themeColor}]} >Good job, </Text>
                <Text style={[tailwind("text-4xl font-bold "),{color: styleColors.themeColor}]} >{profile.username}</Text>
                <Text style={[tailwind("text-4xl font-semibold "),{color: styleColors.themeColor}]} >! </Text>            
            </View>
        </View>    
        
            <View style={[tailwind("flex-1"),{width:"95%",borderWidth:0, alignSelf: "center"}]}>
                <View >
                    <Text style={[tailwind("font-semibold pt-8 pb-4 "),{fontSize:26}]} >{(total.Walk+total.Drink)>0 ?" This month...":"This month you completed..."}</Text>
                </View>
                {total.Walk>0 && (            
                    <View style={tailwind("flex-row  ")}>
                        <Image source={require("../images/man-running.png")} 
                            style={{ width: 50, height: 50 }}
                        />
                        <View style={[tailwind("flex-row flex-wrap flex-1 self-center "),{position:'absolute', marginLeft:"15%"}]}>
                            <Text style={{fontSize:24}} >You've done </Text>
                            <Text style={{fontSize: 24,color: "brown", fontWeight: '700'}} >{total.Walk}</Text>
                            <Text style={{fontSize:24}} > steps</Text>
                        </View>
                    </View>
                )}
                {total.Drink>0 && (
                <View style={[tailwind("flex-row  pt-4 "),{marginLeft:-4}]}>
                    <Image source={require("../images/cup.png")} 
                            style={{ width: 50, height: 50 }}
                        />
                        <View style={[tailwind("flex-row flex-wrap flex-1 self-center "),{position:'absolute', marginLeft:"15%"}]}>
                            <Text style={{fontSize:24}} >You drank </Text>
                            <Text style={{fontSize: 24,color: styleColors.water, fontWeight: '700'}} >{total.Drink}</Text> 
                            <Text style={{fontSize:24}} > glasses </Text>  
                            <Text style={{fontSize:24}} >of water</Text>    
                        </View>
                    </View>
                )}
                {(total.Walk+total.Drink)>0 && (
                <View >
                    <Text style={[tailwind("font-semibold pt-8 "),{fontSize:26}]} >You also completed... </Text>
                </View>
                )}
                <View >
                {Object.keys(total.Custom).map(key => 
                    <View key={key} style={[tailwind("flex-row  pt-4 pl-2")]}>
                         <Image source={require("../images/star.png")} 
                            style={{ width: 35, height: 35 }}
                        />  
                    <View style={[tailwind("flex-row  self-center"),{marginLeft:"2%"}]}>                                                                     
                        <Text style={{fontSize: 24, fontWeight: '700', color: randomColor()}} > {total.Custom[key]} </Text>
                        <Text style={{fontSize:24}} >{total.Custom[key]>1?"times":"time"}</Text>
                        <Text style={{color: randomColor(), fontSize: 24, fontWeight: '700'}}> {key}</Text>
                    </View>
                    </View>
                )}
                </View>
            </View>            
        </View>
        </>)
}

export default RecapScreen
