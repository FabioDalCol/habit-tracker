import React from 'react'
import { View, Text } from 'react-native'
import { styles } from '../styles';
import { styleColors } from '../colors';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons} from "@expo/vector-icons";
import tailwind from 'tailwind-rn';
import store from '../store';
import { incrementValue, decrementValue, setValue, triggerCompleted,pushValue } from '../slices/habitSlice';
import { useSelector } from 'react-redux';
import { selectUser } from '../slices/authSlice';


const categories = {Drink:{icon:"cup-water", color:styleColors.water},     //MOVE CATEGORIES
                      Walk:{icon:"walk",color:"brown"},
                      Custom:{icon:"chess-queen",color:"gray"}
                      }

//const uid ="6GsiMJsZgCjpinhQgyCD";   // TO REPLACE -> PICK FROM STORE


//const api_token = "ciao";

const Habit = ({ id, name, category, desc, countable, value = null, set_value = null, completeToday, uid, api_token }) => {
    
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
    );
  };

export default Habit
