import React, {useState} from 'react'
import { View, Text, RefreshControl } from 'react-native'
import DefaultHeader from '../components/DefaultHeader'
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Habit from '../components/Habit';
import { styleColors } from '../colors';
import { styles } from '../styles';
import getHabits from '../Api';
import { getDate } from '../Api';
import tw from 'tailwind-rn';

//REDUX
import store from '../store'
import { useSelector } from 'react-redux'
import { selectHabits } from '../slices/habitSlice'
import { selectUser } from '../slices/authSlice';


const HabitListScreen = () => {
    
    const habitList = useSelector(selectHabits);
    const user = useSelector(selectUser);
    
    const uid = user.uid
    const api_token = user.api_token;

    const [refreshing,setRefreshing] = useState(false); //pull down to refresh 
    
    return (
        <View style={tw("flex-1")}>
            <DefaultHeader title="Manage Habits"/>
                
                <ScrollView 
                    style={styles.scrollView.manage} //, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, marginBottom: 20}}
                    contentContainerStyle={{paddingBottom: 30}} 
                    showsVerticalScrollIndicator={false}                       
                    refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={()=>{
                                setRefreshing(true); 
                                getHabits(uid,api_token,habitList,setRefreshing)
                            }
                            }/>}
                >
                                
                    {habitList.map(habit =>                       
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
                        manage_habits={true}   
                        is_active={habit.is_active}
                        created={habit.created}                    
                    />                                
                    )}
                </ScrollView>                   
        </View>
    )
}

export default HabitListScreen
