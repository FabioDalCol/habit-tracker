import React from 'react'
import { View, Text, Alert } from 'react-native'
import { styles } from '../styles';
import { styleColors } from '../colors';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons} from "@expo/vector-icons";
import tailwind from 'tailwind-rn';
import store from '../store';
import { incrementValue, decrementValue, setValue, triggerCompleted, pushValue, setIsActive } from '../slices/habitSlice';
import { useSelector } from 'react-redux';
import { selectUser } from '../slices/authSlice';
import { removeHabit, updateHabit } from '../Api';
import { selectHabits } from '../slices/habitSlice';
import getHabits from '../Api';


const categories = {Drink:{icon:"cup-water", color:styleColors.water},     //MOVE CATEGORIES
                      Walk:{icon:"walk",color:"brown"},
                      Custom:{icon:"chess-queen",color:"gray"}
                      }

//const uid ="6GsiMJsZgCjpinhQgyCD";   // TO REPLACE -> PICK FROM STORE


//const api_token = "ciao";
const Habit = ({ id, name, category, desc, countable, value = null, set_value = null, completeToday, uid, api_token, manage_habits = false, is_active, created, show=false,}) => {
const habits = useSelector(selectHabits);

const deleteConfirm = () =>
  Alert.alert(
    "Remove Habit",
    "Are you sure you want to delete this habit?",
    [
      {
        text: "No",
        onPress: () => console.log("Delete annullato"),
        style: "cancel"
      },
      { 
        text: "Yes", 
        onPress: () => {
                          removeHabit(uid,api_token,id); 
                          alert("habit rimosso"); 
                          getHabits(uid,api_token,habits)
                        }
      }
    ]
  );


  if(!manage_habits){
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
            <Text style={{ fontSize: 13, color: styleColors.greyish }}>{desc}</Text>
          </View>
        </View>        
        <View>          
          {countable ? (<>
            <View style={tailwind('flex-row justify-center')}>
              <View>               
                <TextInput  
                  inputContainerStyle={styles.inputTextBox.container} 
                  keyboardType='numeric' 
                  style={[styles.inputValueBox,{width:15+String(value).length*10}]} 
                  value={String(value)}
                  onChangeText={(text)=>store.dispatch(setValue({id:id,value:text}))}
                  onEndEditing = {()=>{store.dispatch(pushValue({id:id,uid:uid,token:api_token}))}}
                />
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
    )
  }
  else{
    return (
                                                  // If habits is completed shows green border 
      <View style={styles.habit.main}>  
             
        <View style={styles.habit.container}>
          <MaterialCommunityIcons
            name={categories[category].icon}
            size={30}
            style={{ color: categories[category].color, marginRight: 5 }}
          />
          <View>
            <Text style={tailwind('text-base')}>{name}</Text>
            {category=='Drink' ?
            (
              <Text style={{ color: styleColors.greyish }}>{'Target daily glasses: '+set_value}</Text>)
              :
              (category=='Walk' ?
              (<Text style={{ color: styleColors.greyish }}>{'Target daily steps: '+set_value}</Text>)
              :
              (<Text style={{ color: styleColors.greyish }}>{desc}</Text>)
            )
          }
            <Text style={{ color: styleColors.greyish }}>{'Created: '+created}</Text>
            
          </View>
        </View>        
        <View style={tailwind('flex-row')}>
          {is_active ? 
          (<>
              <TouchableOpacity> 
                <MaterialCommunityIcons
                  name="stop"
                  size={30}
                  style={{ color: categories[category].color, marginRight:5 }} 
                  onPress={()=>{store.dispatch(setIsActive({id:id,uid:uid,token:api_token})); alert("habit in pause"); getHabits(uid,api_token,habits) }}                
                />
              </TouchableOpacity> 
            </>):
            (<>
              <TouchableOpacity> 
                <MaterialCommunityIcons
                  name="play"
                  size={30}
                  style={{ color: categories[category].color,  marginRight:5 }} 
                  onPress={()=>{store.dispatch(setIsActive({id:id,uid:uid,token:api_token})); alert("habit in pause"); getHabits(uid,api_token,habits) }}                             
                />
              </TouchableOpacity> 
            </>)}

            <TouchableOpacity> 
              <MaterialCommunityIcons
                  name="pencil"
                  size={30}
                  style={{ color: categories[category].color }}
                  onPress={()=>{show=true; console.log('SHOW IS '+ show);}}
                />
            </TouchableOpacity> 
            {/* {console.log('qua invece '+ show)}
            {true && (<>          
            <View>
            <Text style={tailwind('text-base')}>{name}</Text>
            <Text style={{ fontSize: 13, color: styleColors.greyish }}>{desc}</Text>
            </View>
            </>)} */}

            <TouchableOpacity> 
              <MaterialCommunityIcons
                name="trash-can"
                size={30}
                style={{ color: categories[category].color, marginLeft: 5 }} 
                onPress={()=>{deleteConfirm()}}                
              />
            </TouchableOpacity> 
        </View>
    </View>
    )
    
  }
};

export default Habit
