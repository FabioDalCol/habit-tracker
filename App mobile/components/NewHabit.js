import React from 'react'
import { StyleSheet, View, Text, Platform, Button, Pressable } from 'react-native'
import { Input, CheckBox} from 'react-native-elements';
import { ScreenContainer } from 'react-native-screens';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { styles } from '../styles';
import { add } from 'react-native-reanimated';
import { useState } from 'react';
import { useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { color } from 'react-native-elements/dist/helpers';
import getHabits, { addHabit, getDate} from "../Api";


const NewHabit = (props ) => {
  
    const uid = props.uid;
    const api_token = props.api_token;
    const habits = props.habits;
    const {newHabitForm, setNewHabitForm}=props.state;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const categories= ['Drink', 'Walk', 'Custom'];  
  

    const onChange_start = (event, selectedDate) => {
        const currentDate = selectedDate || newHabitForm.Date_start;
        setNewHabitForm({...newHabitForm, Show_start:(Platform.OS === 'ios'), Date_start:currentDate}); 
      };


    const onChange_end = (event, selectedDate) => {
        const currentDate = selectedDate || newHabitForm.Date_end;
        setNewHabitForm({...newHabitForm, Show_end:(Platform.OS === 'ios'), Date_end:currentDate}); 
      };


    const showTimepicker_start = () => {
        setNewHabitForm({...newHabitForm, Show_start:true, Mode:'time'});
        };

    const showTimepicker_end = () => {
        setNewHabitForm({...newHabitForm, Show_end:true, Mode:'time'});
        };

    const makeTwoDigits = (time) => {
            const timeString = `${time}`;
            if (timeString.length === 2) return time
            return `0${time}`
          }

    const makeHabit = () => {
        var habit={
            name: newHabitForm.HabitName ? newHabitForm.HabitName : newHabitForm.Category, 
            desc: newHabitForm.Description ? newHabitForm.Description : 'Default Habit', 
            category: newHabitForm.Category, 
            created: getDate(), 
            repeat_days: {
                Thu: newHabitForm.Thu,
                Fri: newHabitForm.Fri,
                Sat: newHabitForm.Sat,
                Wed: newHabitForm.Wed,
                Sun: newHabitForm.Sun,
                Tue: newHabitForm.Tue,
                Mon: newHabitForm.Mon
                },
            value: 0,
            countable: newHabitForm.Category!='Custom',
            set_value: pickTarget(newHabitForm.Category),
            reminder: newHabitForm.Times,
            is_active: true,
            };  
        return habit;
    }  

    const pickTarget = (param) => 
            {
                switch(param) {
                    case 'Custom':
                        return undefined;
                    case 'Drink':
                        return newHabitForm.Drink_target;
                    case 'Walk':
                        return newHabitForm.Walk_target;
                    default:
                        console.log('Category is undefined');
                        return null;
                }
            }
            
    const renderSwitch = (param) => 
            {
            
            switch(param) {
                case 'Custom':
                    return (<>                
                            <Input value={newHabitForm.HabitName} onChangeText={(text)=> setNewHabitForm({...newHabitForm,HabitName:text})} inputContainerStyle={styles.inputTextBox.container}  style={styles.inputTextBox.box} placeholder="Habit name"/>
                            <Input value={newHabitForm.Description} onChangeText={(text)=> setNewHabitForm({...newHabitForm,Description:text})} inputContainerStyle={styles.inputTextBox.container}  style={styles.inputTextBox.box} maxLength={250} multiline = {true} placeholder="Description"/>
                            
                            {/* MORE CUSTOMIZZATION HABIT
                            <View style={{justifyContent: 'center',  flex: 1}}>
                                <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>Countable</Text>
                                <CheckBox
                                iconRight
                                iconType='material'
                                checked={newHabitForm.Countable}
                                onPress={()=>setNewHabitForm({...newHabitForm,Countable:!newHabitForm.Countable})}
                                checkedIcon='check-circle-outline'
                                uncheckedIcon='radio-button-unchecked'
                                containerStyle={styles.checkBoxDays.container}
                                /> 
                            </View>
  
                            {newHabitForm.Target_type=='numeric' &&
                            (<>
                                <Input value={newHabitForm.Target_name} onChangeText={(text)=> setNewHabitForm({...newHabitForm,Target_name:text})} inputContainerStyle={styles.inputTextBox.container}  style={styles.inputTextBox.box} maxLength={250} multiline = {true} placeholder="Target name es. steps, glass, km"/>
                                <Input value={newHabitForm.Target} onChangeText={(text)=> setNewHabitForm({...newHabitForm,Target:text})} inputContainerStyle={styles.inputTextBox.container}  style={styles.inputTextBox.box} keyboardType='number-pad' placeholder={"Insert target daily "+newHabitForm.Target_name}/>
                            </>)} */}
                            
                            </>);
                case 'Drink':
                    //{setNewHabitForm({...newHabitForm, HabitName:param})};
                    return (<>
                            <View style={{flexDirection: 'row', flex:1, justifyContent: 'center', marginLeft:'auto'}}>  
                                <View style={{flex:0.2}}>                         
                                <Input inputContainerStyle={[styles.inputTextBox.container]}  style={styles.inputTextBox.box} value={newHabitForm.Drink_target} onChangeText={(text)=> setNewHabitForm({...newHabitForm,Drink_target:text})} keyboardType='number-pad' placeholder="Insert daily"/>
                                </View>
                                <View style={{flex:0.5}}>
                                <Text style={{fontSize: 16, marginTop:'7%', fontWeight: 'bold'}}>Glasses</Text> 
                                </View>
                            </View>
                            {/* <View style={{flex:8, justifyContent: "space-around", flexDirection: "row"}}>
                                <View>
                                    <Pressable style={styles.buttone} onPress={showTimepicker_start} title="Inserisci ora fine">
                                        <Text style={styles.text}>Rise time</Text>
                                        <Text style={styles.text, {color: 'white', fontWeight: 'bold',}}>{makeTwoDigits(newHabitForm.Date_start.getHours())+':'+makeTwoDigits(newHabitForm.Date_start.getMinutes())}</Text>
                                    </Pressable>
                                </View>
                                {newHabitForm.Show_start && (
                                    <DateTimePicker
                                    testID="dateTimePicker"
                                    value={newHabitForm.Date_start}
                                    mode={newHabitForm.Mode}
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChange_start}
                                    />     
                                )}

                                <View>
                                    <Pressable style={styles.buttone} onPress={showTimepicker_end} title="Inserisci ora fine">
                                        <Text style={styles.text}>Sleep time</Text>
                                        <Text style={styles.text, {color: 'white', fontWeight: 'bold',}}>{makeTwoDigits(newHabitForm.Date_end.getHours())+':'+makeTwoDigits(newHabitForm.Date_end.getMinutes())}</Text>
                                    </Pressable>
                                </View>
                                {newHabitForm.Show_end && (
                                    <DateTimePicker
                                    testID="dateTimePicker"
                                    value={newHabitForm.Date_end}
                                    mode={newHabitForm.Mode}
                                    is24Hour={true}
                                    display="default"
                                    onChange={onChange_end}
                                    />     
                                )}
                            </View> */}
                            </>);
                case 'Walk':
                    {/* {(param) => setNewHabitForm({...newHabitForm, HabitName:param})} */}
                    return (<>                
                            <View style={{flexDirection: 'row', flex:1, justifyContent: 'center', marginLeft:'auto'}}>  
                                <View style={{flex:0.3}}>                         
                                <Input inputContainerStyle={[styles.inputTextBox.container]}  style={styles.inputTextBox.box} value={newHabitForm.Walk_target} onChangeText={(text)=> setNewHabitForm({...newHabitForm,Walk_target:text})} keyboardType='number-pad' placeholder="Insert daily"/>
                                </View>
                                <View style={{flex:0.5}}>
                                <Text style={{fontSize: 16, marginTop:'7%', fontWeight: 'bold'}}>Steps</Text> 
                                </View>
                            </View></>);   
                default:
                    return null;
                }
            }

    useEffect(() => {
        var sum=true;
        for(var d of days){
            sum=sum*newHabitForm[d]
        }
        setNewHabitForm({...newHabitForm,Eve:sum})
    }, [newHabitForm.Mon, newHabitForm.Tue, newHabitForm.Wed, newHabitForm.Thu, newHabitForm.Fri, newHabitForm.Sat, newHabitForm.Sun])

    if (props.show == false){
        return(null)
    }

    else { //add Habit save 
        return (
            <View style={props.viewStyle}>
                <View style={{justifyContent: 'center'}}>
                <RNPickerSelect
                    containerStyle={styles.dropdown.container}
                    useNativeAndroidPickerStyle={false}
                    style={styles.dropdownCategory}
                    onValueChange={(value) => setNewHabitForm({...newHabitForm,Category:value})}
                    items={categories.map((num) => ({'label': num, 'value': num}))}
                    placeholder={{
                        label: 'Select a category',
                        value: null,
                    }}
                />      
                {renderSwitch(newHabitForm.Category)}  
                </View>
                {newHabitForm.Category!=undefined && (<>
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{justifyContent: 'center', flex: 1}}>
                        <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>Mon</Text>
                        <CheckBox
                        iconRight
                        iconType='material'
                        checked={newHabitForm.Mon}
                        onPress={()=>setNewHabitForm({...newHabitForm,Mon:!newHabitForm.Mon})}                        
                        checkedIcon='check-circle-outline'
                        uncheckedIcon='radio-button-unchecked'
                        containerStyle={styles.checkBoxDays.container}
                        />                        
                    </View>
                    <View style={{justifyContent: 'center',  flex: 1}}>
                        <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>Tue</Text>
                        <CheckBox
                        iconRight
                        iconType='material'
                        checked={newHabitForm.Tue}
                        onPress={()=>setNewHabitForm({...newHabitForm,Tue:!newHabitForm.Tue})}
                        checkedIcon='check-circle-outline'
                        uncheckedIcon='radio-button-unchecked'
                        containerStyle={styles.checkBoxDays.container}
                        /> 
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'baseline', flex: 1}}>
                        <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>Wed</Text>
                        <CheckBox
                        iconRight
                        iconType='material'
                        checked={newHabitForm.Wed}
                        onPress={()=>setNewHabitForm({...newHabitForm,Wed:!newHabitForm.Wed})}
                        checkedIcon='check-circle-outline'
                        uncheckedIcon='radio-button-unchecked'
                        containerStyle={styles.checkBoxDays.container}
                        /> 
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'baseline', flex: 1}}>
                        <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>Thu</Text>
                        <CheckBox
                        iconRight
                        iconType='material'
                        checked={newHabitForm.Thu}
                        onPress={()=>setNewHabitForm({...newHabitForm,Thu:!newHabitForm.Thu})}
                        checkedIcon='check-circle-outline'
                        uncheckedIcon='radio-button-unchecked'
                        containerStyle={styles.checkBoxDays.container}
                        /> 
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'baseline', flex: 1}}>
                        <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>Fri</Text>
                        <CheckBox
                        iconRight
                        iconType='material'
                        checked={newHabitForm.Fri}
                        onPress={()=>setNewHabitForm({...newHabitForm,Fri:!newHabitForm.Fri})}
                        checkedIcon='check-circle-outline'
                        uncheckedIcon='radio-button-unchecked'
                        containerStyle={styles.checkBoxDays.container}
                        /> 
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'baseline', flex: 1}}>
                        <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>Sat</Text>
                        <CheckBox
                        iconRight
                        iconType='material'
                        checked={newHabitForm.Sat}
                        onPress={()=>setNewHabitForm({...newHabitForm,Sat:!newHabitForm.Sat})}
                        checkedIcon='check-circle-outline'
                        uncheckedIcon='radio-button-unchecked'
                        containerStyle={styles.checkBoxDays.container}
                        /> 
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'baseline', flex: 1}}>
                        <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>Sun</Text>
                        <CheckBox
                        iconRight
                        iconType='material'
                        checked={newHabitForm.Sun}
                        onPress={()=>setNewHabitForm({...newHabitForm,Sun:!newHabitForm.Sun})}
                        checkedIcon='check-circle-outline'
                        uncheckedIcon='radio-button-unchecked'
                        containerStyle={styles.checkBoxDays.container}
                        /> 
                    </View>
                </View>

                <View style={{justifyContent: 'center', flex: 0.5}}>
                        <Text style={{alignSelf: 'center', fontWeight: 'bold'}}>Everyday</Text>
                        <CheckBox
                            //title='Everyday'
                            iconRight
                            iconType='material'
                            checked={newHabitForm.Eve}
                            onPress={()=>{
                                let diz={};                           
                                for (var key of days) {
                                    diz[key]=!newHabitForm['Eve'];                          
                                    } 
                                setNewHabitForm({...newHabitForm,...diz,Eve:!newHabitForm['Eve']});
                            }}
                            checkedIcon='check-circle-outline'
                            uncheckedIcon='radio-button-unchecked'
                            containerStyle={styles.checkBoxDays.container}
                            />
                </View> 

                <View style={{flexDirection: 'row', flex:1, justifyContent: 'center'}}> 
                    <View style={{justifyContent: 'center', flex: 0.5, flexDirection:'row'}}>
                        <Text style={{alignSelf: 'center', fontWeight: 'bold', marginRight: '-8%'}}>Reminder</Text>
                        <CheckBox
                        iconRight
                        iconType='material'
                        checked={newHabitForm.Reminder}
                        onPress={()=>setNewHabitForm({...newHabitForm,Reminder:!newHabitForm.Reminder})}
                        checkedIcon='check-circle-outline'
                        uncheckedIcon='radio-button-unchecked'
                        containerStyle={[styles.checkBoxDays.container]}
                        /> 
                    </View>
                    {newHabitForm.Reminder &&(<View style={{flex: 0.4, marginLeft:'-8%', marginTop: '3%'}}>
                    <RNPickerSelect
                                    containerStyle={styles.dropdown.container}
                                    useNativeAndroidPickerStyle={false}
                                    style={styles.dropdown}
                                    value={newHabitForm.Times}
                                    onValueChange={(value) => setNewHabitForm({...newHabitForm,Times:value})}
                                    items={[0,1,2,3,4,6].map((num) => ({'label': num+" volte", 'value': num}))}
                                    placeholder={{
                                        label: 'Number of daily reminders',
                                        value: null,
                                    }}

                    />
                    </View>
                    )}
                </View>

                <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 2}}>
                        <TouchableOpacity style={{flex: 1}}>
                            <MaterialCommunityIcons
                                name="trash-can"
                                size={30}
                                style={{ color: 'red', marginLeft: 5 }} 
                                onPress={()=>props.setShow(false)}                
                            />
                        </TouchableOpacity> 
                        <TouchableOpacity style={{flex: 1}}>
                            <MaterialCommunityIcons
                                name="send"
                                size={30}
                                style={{ color: '#4263ec'}} // da rivedere perchè non responsive 
                                onPress={() => {addHabit(uid, api_token, makeHabit()); props.setShow(false); getHabits(uid, api_token, habits)}}
                            />
                        </TouchableOpacity> 
                </View>
                </>)}
        </View>
        )
    }   
}

export default NewHabit



