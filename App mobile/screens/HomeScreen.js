import * as React from "react";
import { View, Text, RefreshControl, StatusBar, Platform } from "react-native";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { selectUser, selectProfile } from "../slices/authSlice";
import tailwind from "tailwind-rn";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout } from "../hooks/useAuth";
import NewHabit from "../components/NewHabit";
import { useState } from "react";
import { useRef } from 'react';
import { styles } from "../styles";
import { styleColors } from '../colors'
import getHabits, { countCompletedHabits } from "../Api";
import { selectHabits, selectNotifDB, selectRefreshing} from "../slices/habitSlice";
import { TextInput } from "react-native-gesture-handler";
import store from "../store";
import {decrementValue, incrementValue, triggerCompleted, initDay, setValue  } from "../slices/habitSlice";
import clone from 'just-clone';
import { useEffect } from "react";
import { getDate } from "../Api";
import { getTodayHabits } from "../Api";
import { colors } from "react-native-elements";
import Habit from "../components/Habit";
import HomeHeader from "../components/HomeHeader";
import NotificationHandler, { cancel, deleteChannel, getNotification, scheduleHabitNotification, stacca } from "../NotificationHandler"
import { scheduleNotificationAsync } from "expo-notifications";
import { schedulePushNotification } from "../NotificationHandler";
import { weekDays } from "../Api";


const HomeScreen = ({navigation}) => {

  const scrollRef = useRef();

  const onPressAdd = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  const user = useSelector(selectUser);
 
  const uid = user.uid
  const api_token = user.api_token;
 
  const profile = useSelector(selectProfile);

  const notifDB = useSelector(selectNotifDB)

  
  useEffect(() => {   
  getHabits(uid,api_token,{})
  //console.log("Got new habits")
  }, [])
  const [showView, setShowView] = useState(false);   
  const [newHabitForm, setNewHabitForm] = useState({Walk_target:'10000',Drink_target:'10',Times:0,Reminder:false, HabitName:'Default',Target_name:'',Mode:'time',Date_start:new Date(1598051730000), Date_end:new Date(1598051730000), Show_end:false, Show_start:false, Picker_value:'vuoto',Mon:false,Tue:false,Wed:false,Thu:false,Fri:false,Sat:false,Sun:false,Eve:false})
  const [refreshing,setRefreshing] = useState(false); //pull down to refresh  
  const [note, setNote] = useState({expoPushToken:'',notification:false})
  
  const categories = {Drink:{icon:"cup-water", color:styleColors.water},
                      Walk:{icon:"walk",color:"brown"},
                      Custom:{icon:"chess-queen",color:"gray"}
                      }
      
  

  const setNewHabitComp = () => {
    setShowView(!showView)
  }  

  const newhabits = useSelector(selectHabits);

  useEffect(() => {
    if (newhabits != undefined){
      store.dispatch(initDay({uid:uid,token:api_token}))
      for(let habit of newhabits){
        if(habit.reminder>0){     
          scheduleHabitNotification(habit,profile.rise_time,profile.sleep_time,notifDB);
          console.log("habit con reminder");
        }
      }
    }
  }, [newhabits])
  
  var todayHabits = getTodayHabits(newhabits);
  var completedHabitsCount = countCompletedHabits(todayHabits,newhabits);  
  const dailyProgressColor = () => {    
    if(completedHabitsCount/todayHabits.length<=1/3){
      return {backgroundColor: styleColors.pbRed }
    }
    if(completedHabitsCount/todayHabits.length<=1/2){
      return {backgroundColor: styleColors.pbOrange }
    }
    else{
      return {backgroundColor: styleColors.greenComp }
    }
  }

  console.log(notifDB);

  const repeatDays = (activeDays) => {
    var days = ""
    for(var day of weekDays){
      if(activeDays[day]){
        days = days + day + ", "
      }
    }
    days= days.slice(0, -2);
    return days
  }
  //console.log(newhabits)  

  
  return (
    <View style={[tailwind('flex-1'),{backgroundColor: styleColors.themeColor}]} >
      <StatusBar barStyle="light-content" backgroundColor={styleColors.themeColor} />      
      <HomeHeader/>      
      <View style={tailwind('py-0 px-4')}>
        <Text style={[tailwind('text-4xl'),{ color: styleColors.white}]}>
          Hi,{"\n" + user?.fullname?.split(/(\s+)/)[0]}
        </Text>          
      </View>     

          
      
      <View style={styles.infoBox} >
            <Text style={tailwind('text-2xl pb-4 ')}>Progress</Text>
            <View style={tailwind(" h-8 relative max-w-xl rounded-full overflow-hidden")}>
              <View style={tailwind("w-full h-full bg-gray-200 absolute")}>
              <View style={[tailwind(" h-full absolute"),dailyProgressColor(),{width: completedHabitsCount/todayHabits.length*100+"%"}]}></View>
              <View style={tailwind("flex-1 justify-center")}>
              <Text style={tailwind("text-center text-base font-semibold")}> {completedHabitsCount} of {todayHabits.length}</Text>
              </View>
              </View>              
            </View>
        </View>      

      <View style={styles.habitBox}>
        <Text style={tailwind('text-2xl')}>Daily Habits</Text>
        <TouchableOpacity onPress={()=>{
          setNewHabitComp();
          onPressAdd();
          }}> 
          <MaterialCommunityIcons
            name="plus" //
            size={40}
            style={[{color: styleColors.themeColor, backgroundColor: styleColors.white}, styles.plusButton]}
            // onPress={async () => {
            //   await schedulePushNotification(3);
            // }}
          />
        </TouchableOpacity>   
        
        <TouchableOpacity onPress={async () => {
            await schedulePushNotification(3,profile.rise_time,profile.sleep_time);
          }}> 
          <MaterialCommunityIcons
            name="plus" //
            size={40}
            style={[{color: styleColors.themeColor, backgroundColor: styleColors.white}, styles.plusButton]}
          />
        </TouchableOpacity>  

        <TouchableOpacity onPress={async () => {
            await cancel();
          }}> 
          <MaterialCommunityIcons
            name="minus" //
            size={40}
            style={[{color: styleColors.themeColor, backgroundColor: styleColors.white}, styles.plusButton]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={async () => {
            await getNotification();
          }}> 
          <MaterialCommunityIcons
            name="account" //
            size={40}
            style={[{color: styleColors.themeColor, backgroundColor: styleColors.white}, styles.plusButton]}
          />
        </TouchableOpacity> 
        
        
      </View>
    
      <ScrollView 
        style={styles.scrollView.home} //, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginBottom: 20}}
        contentContainerStyle={{paddingBottom: 20}}
        ref={scrollRef}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={()=>{
                    setRefreshing(true); 
                    getHabits(uid,api_token,newhabits,setRefreshing)
                  }
                }
          />}>
    
        <NewHabit viewStyle = {styles.newHabit} show={showView} state={{newHabitForm,setNewHabitForm}} setShow={setNewHabitComp} uid={uid} api_token={api_token} />

        
        
        {newhabits?.map(habit => 
         (getTodayHabits(newhabits)?.includes(habit.id) && (
          <Habit
            key={habit.id} 
            id = {habit.id}             
            name={habit.name}
            category={habit.category}
            desc={(repeatDays(habit.repeat_days).split(',').length>6) ? 'Everyday':repeatDays(habit.repeat_days)}
            countable={habit.countable}
            value={habit.value}
            set_value={habit.set_value}
            completeToday={habit.stats != undefined ? habit.stats[getDate()]?.completed : false}           
            date={getDate()}  
          />
         )        
         )
        )}
      </ScrollView>   
    </View> 
  );
}

export default HomeScreen;