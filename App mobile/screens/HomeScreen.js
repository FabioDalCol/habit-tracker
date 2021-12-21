import * as React from "react";
import { View, Text, StatusBar, RefreshControl } from "react-native";
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
import getHabits from "../Api";
import { selectHabits, selectRefreshing} from "../slices/habitSlice";
import { TextInput } from "react-native-gesture-handler";
import store from "../store";
import {decrementValue, incrementValue, triggerCompleted  } from "../slices/habitSlice";
import clone from 'just-clone';
import { useEffect } from "react";
import { getDate } from "../Api";



const HomeScreen = ({navigation}) => {

  const scrollRef = useRef();

  const onPressAdd = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  const user = useSelector(selectUser);
  const uid ="6GsiMJsZgCjpinhQgyCD";
  const api_token = "ciao";
   // const { user } = useAuth();

   useEffect(() => {
    getHabits(uid,api_token,{})
    console.log("Got new habits")
}, [])

  const [showView, setShowView] = useState(false);   
  const [newHabitForm, setNewHabitForm] = useState({Target_name:'',Mode:'time',Date_start:new Date(1598051730000), Date_end:new Date(1598051730000), Show_end:false, Show_start:false, Picker_value:'vuoto',Mon:false,Tue:false,Wed:false,Thu:false,Fri:false,Sat:false,Sun:false,Eve:false})
  const [refreshing,setRefreshing] = useState(false); //pull down to refresh  

  const categories = {Drink:{icon:"cup-water", color:styleColors.water},
                      Walk:{icon:"walk",color:"brown"},
                      Custom:{icon:"chess-queen",color:"gray"}
                      }
      
  const Habit = ({ id, name, category, desc, countable, value = null, set_value = null, completeToday }) => {
    return (
                                                  // If habits is completed shows green border 
      <View style={[styles.habit.main, completeToday ? {borderWidth: 2} : {}]}>  
        {completeToday && (
          <View style={tailwind('absolute')}>
            <MaterialCommunityIcons
                name="check-box-outline"
                size={22}
                style={styles.habit.completed}                           
              />
            </View> 
          ) 
        }     
        <View style={styles.habit.container}>
          <MaterialCommunityIcons
            name={categories[category].icon}
            size={30}
            style={{ color: categories[category].color, marginRight: 5 }}
          />
          <View>
            <Text style={tailwind('text-base')}>{name}</Text>
            <Text style={{ color: styleColors.greyish }}>{desc}</Text>
          </View>
        </View>        
        <View>          
          {countable ? (<>
            <View style={tailwind('flex-row justify-center')}>
              <View>               
                <TextInput  inputContainerStyle={styles.inputTextBox.container} style={[styles.inputValueBox,{width:15+String(value).length*10}]} value={String(value)}/>
              </View>              
              <Text style={[tailwind("text-center font-semibold"),{fontSize:18}]}>/{set_value}</Text>              
            </View>

            <View style={tailwind('flex-row justify-end pt-1'  )}> 
            <TouchableOpacity onPress={()=>store.dispatch(incrementValue({id:id,uid:uid,token:api_token}))} >           
            <MaterialCommunityIcons
              name="plus-circle-outline"
              size={25}
              style={{ color: categories[category].color }}
            />
              </TouchableOpacity>
            <TouchableOpacity onPress={()=>store.dispatch(decrementValue({id:id,uid:uid,token:api_token}))} > 
            <MaterialCommunityIcons
              name="minus-circle-outline"
              size={25}
              style={{ color: categories[category].color, marginLeft: 5 }}                           
            />
            </TouchableOpacity> 
            </View>
            </>
          ):(<>
            <View style={tailwind('pr-4 ')}>
              <TouchableOpacity onPress={()=>store.dispatch(triggerCompleted({id:id,uid:uid,token:api_token}))}>              
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={25}
                  style={{ color: categories[category].color, marginLeft: 5 }}                    
                />
              </TouchableOpacity>                        
            </View>
          </>)}        
      </View>
    </View>
    );
  };

  const setNewHabitComp = () => {
    setShowView(!showView)
  }  

  const newhabits = useSelector(selectHabits);
  
  //console.log(newhabits)   
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
          <TouchableOpacity onPress={()=> {getHabits(uid,api_token,newhabits); console.log(newhabits)}} >
            <MaterialCommunityIcons
              name="bell-outline" //
              size={30}
              style={{ color: styleColors.white }}
            />
            </TouchableOpacity>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={()=>{
                    setRefreshing(true); 
                    getHabits(uid,api_token,newhabits,setRefreshing)
                  }
                }
          />}>
    
        <NewHabit viewStyle = {styles.newHabit} show={showView} state={{newHabitForm,setNewHabitForm}} setShow={setNewHabitComp}/>                                             

        {newhabits?.map(habit => (          
          <Habit
            key={habit.id} 
            id = {habit.id}             
            name={habit.name}
            category={habit.category}
            desc={habit.desc}
            countable={habit.countable}
            value={habit.value}
            set_value={habit.set_value}
            completeToday={habit.countable ? habit.value >= habit.set_value : habit.completed.includes(getDate())}      
          />
        ))}
      </ScrollView>   
    </View> 
  );
}

export default HomeScreen;