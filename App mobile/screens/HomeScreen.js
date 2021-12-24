import * as React from "react";
import { View, Text, RefreshControl, StatusBar, Platform } from "react-native";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/authSlice";
import tailwind from "tailwind-rn";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout } from "../hooks/useAuth";
import NewHabit from "../components/NewHabit";
import { useState } from "react";
import { useRef } from 'react';
import { styles } from "../styles";
import { styleColors } from '../colors'
import getHabits, { countCompletedHabits } from "../Api";
import { selectHabits, selectRefreshing} from "../slices/habitSlice";
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
import NotificationHandler from "../NotificationHandler"
import { scheduleNotificationAsync } from "expo-notifications";


const HomeScreen = ({navigation}) => {

  const scrollRef = useRef();

  const onPressAdd = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  const user = useSelector(selectUser);
  //const uid ="6GsiMJsZgCjpinhQgyCD";
  const uid = user.uid
  const api_token = user.api_token;
   // const { user } = useAuth();

   useEffect(() => {
    getHabits(uid,api_token,{})
    console.log("Got new habits")
}, [])
  const [showView, setShowView] = useState(false);   
  const [newHabitForm, setNewHabitForm] = useState({Walk_target:'10000',Drink_target:'10',Times:0,Reminder:false,Target_name:'',Mode:'time',Date_start:new Date(1598051730000), Date_end:new Date(1598051730000), Show_end:false, Show_start:false, Picker_value:'vuoto',Mon:false,Tue:false,Wed:false,Thu:false,Fri:false,Sat:false,Sun:false,Eve:false})
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
  //console.log(newhabits)   
  console.log(user.uid)
  console.log(user.api_token)

  
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

        <TouchableOpacity onPress={()=>{
            scheduleNotificationAsync(3)
          }}> 
          <MaterialCommunityIcons
            name="plus" //
            size={40}
            style={[{color: styleColors.themeColor, backgroundColor: styleColors.white}, styles.plusButton]}
          />
        </TouchableOpacity>   
          
      </View>
    
      <ScrollView 
        style={{backgroundColor: styleColors.background,marginHorizontal: 6}} //, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginBottom: 20}}
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
    
        <NewHabit viewStyle = {styles.newHabit} show={showView} state={{newHabitForm,setNewHabitForm}} setShow={setNewHabitComp} uid={uid} api_token={api_token} habits={newhabits}/>

        <NotificationHandler show={showView} state={{note,setNote}} setShow={setNewHabitComp}/>
        
        {newhabits?.map(habit => 
         (getTodayHabits(newhabits)?.includes(habit.id) && (
          <Habit
            key={habit.id} 
            id = {habit.id}             
            name={habit.name}
            category={habit.category}
            desc={habit.desc}
            countable={habit.countable}
            value={habit.value}
            set_value={habit.set_value}
            completeToday={habit.stats != undefined ? habit.stats[getDate()]?.completed : false}
            uid={uid}
            api_token={api_token}   
          />
         )        
         )
        )}
      </ScrollView>   
    </View> 
  );
}

export default HomeScreen;