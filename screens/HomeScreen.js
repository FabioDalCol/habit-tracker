import * as React from "react";
import { View, Text, StatusBar } from "react-native";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/authSlice";
import tailwind from "tailwind-rn";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout } from "../hooks/useAuth";
import NewHabit from "../components/NewHabit";
import { NavigationContainer } from "@react-navigation/native";
import { useState } from "react";
import { useRef } from 'react';
import { styles } from "../styles";
import { styleColors } from '../colors'
import axios from 'axios';

const HomeScreen = ({navigation}) => {


  // const fetchUser = async () => {
  //   const url = `https://habits-app-api.ew.r.appspot.com/api/v1/users/6GsiMJsZgCjpinhQgyCD/habits/BaVMYIr0Gs8xQfshL3qn`;
  //   const response = await axios.get(url,{headers:{token: "ciao"}});
  //   console.log(response.data);
  // };

  // fetchUser();

  const scrollRef = useRef();

  const onPressAdd = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  const user = useSelector(selectUser);
   // const { user } = useAuth();

  const [showView, setShowView] = useState(false);   
  const [newHabitForm, setNewHabitForm] = useState({Mon:false,Tue:false,Wed:false,Thu:false,Fri:false,Sat:false,Sun:false,Eve:false})

      const habits = [
        {
          id: 1,
          habit: "Morning Walk",
          icon: "hiking",
          theme: "#008b8b",
          stamp: "Today . 8am"
        },
        {
          id: 2,
          habit: "Meet with HR",
          icon: "account-tie",
          theme: "#37003c",
          stamp: "Today . 12 noon"
        },
        {
          id: 3,
          habit: "Shopping with familly",
          icon: "cart",
          theme: "#fed132",
          stamp: "Tomorrow . 3"
        },
        {
          id: 4,
          habit: "Time for Gym",
          icon: "weight",
          theme: "#008b8b",
          stamp: "Saturday . 4pm"
        },
        {
          id: 5,
          habit: "Time for Gym",
          icon: "weight",
          theme: "#008b8b",
          stamp: "Saturday . 4pm"
        },
        {
          id: 6,
          habit: "Time for Gym",
          icon: "weight",
          theme: "#008b8b",
          stamp: "Saturday . 4pm"
        },
        {
          id: 7,
          habit: "Time for Gym",
          icon: "weight",
          theme: "#008b8b",
          stamp: "Saturday . 4pm"
        },
        {
          id: 8,
          habit: "Time for Gym",
          icon: "weight",
          theme: "#008b8b",
          stamp: "Saturday . 4pm"
        },
        {
          id: 9,
          habit: "Time for Gym",
          icon: "weight",
          theme: "#008b8b",
          stamp: "Saturday . 4pm"
        },{
          id: 10,
          habit: "Time for Gym",
          icon: "weight",
          theme: "#008b8b",
          stamp: "Saturday . 4pm"
        }
      
      ];
      
      const Habit = ({ habit, icon, theme, stamp }) => {
        return (
          <View style={styles.habit.main}>
            <View style={styles.habit.container}>
              <MaterialCommunityIcons
                name={icon}
                size={30}
                style={{ color: theme, marginRight: 5 }}
              />
              <View>
                <Text style={tailwind('text-base')}>{habit}</Text>
                <Text style={{ color: styleColors.greyish }}>{stamp}</Text>
              </View>
            </View>
      
            <View style={tailwind('flex-row')}>
              <MaterialCommunityIcons
                name="pencil"
                size={30}
                style={{ color: theme }}
              />
            <TouchableOpacity > 
              <MaterialCommunityIcons
                name="trash-can"
                size={30}
                style={{ color: theme, marginLeft: 5 }} 
                onPress={()=>console.log("Ho premuto "+ habit)}                
              />
              </TouchableOpacity> 
            </View>
          </View>
        );
      };

  const setNewHabitComp = () => {
    setShowView(!showView)
  }  

  
  console.log(user.uid)
  console.log(user.api_token)

  return (
    <View style={[tailwind('flex-1'),{backgroundColor: styleColors.themeColor}]} >
      <StatusBar barStyle="light-content" backgroundColor={styleColors.themeColor} />
      <View style={{ backgroundColor: styleColors.themeColor }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={()=> navigation.openDrawer() }>
          <MaterialCommunityIcons
            name="text"
            size={30}
            style={{ color: styleColors.white }}
          />
          </TouchableOpacity>
          <View style={tailwind('flex-row')}>
            <MaterialCommunityIcons
              name="bell-outline" //
              size={30}
              style={{ color: styleColors.white }}
            />
            <TouchableOpacity onPress={()=> {logout()}} >
            <AntDesign name="user" size={30} style={{ color: styleColors.white }} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={tailwind('py-0 px-4')}>
          <Text style={[tailwind('text-4xl'),{ color: styleColors.white}]}>
            Ciao,{"\n" + user?.fullname?.split(/(\s+)/)[0]}
          </Text>          
        </View>
      </View>
      
      
      <View style={styles.infoBox} >
            <Text style={tailwind('text-2xl pb-4 ')}>Daily habits</Text>
            <View style={tailwind(" h-8 relative max-w-xl rounded-full overflow-hidden")}>
              <View style={tailwind("w-full h-full bg-gray-200 absolute")}>
              <View style={tailwind(" h-full bg-green-500 absolute w-1/5")}></View>
              <View style={tailwind("flex-1 justify-center")}>
              <Text style={tailwind("text-center text-base font-semibold")}> 1 of 5</Text>
              </View>
              </View>
              
            </View>         

        </View>
             


     

      <View style={styles.habitBox}>
        <Text style={tailwind('text-2xl')}>Habits</Text>
        <TouchableOpacity onPress={()=>{
          setNewHabitComp();
          onPressAdd();
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
      >
        
        <NewHabit viewStyle = {styles.newHabit} show={showView} state={{newHabitForm,setNewHabitForm}} setShow={setNewHabitComp}/>                                             

        {habits.map(habit => (          
          <Habit
            key={habit.id}
            habit={habit.habit}
            icon={habit.icon}
            theme={habit.theme}
            stamp={habit.stamp}
          />
        ))}
      </ScrollView> 
    </View>
    
  );
}

export default HomeScreen;
