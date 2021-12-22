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
import { addHabit, getDate} from "../Api";


const NewHabit = (props ) => {
  
    const uid ="6GsiMJsZgCjpinhQgyCD";
    const api_token = "ciao";
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
        habit={
            name: newHabitForm.HabitName ? newHabitForm.HabitName : 'vuota', 
            desc: newHabitForm.Description ? newHabitForm.Description : 'vuota', 
            category: newHabitForm.Category, 
            created: new Date(), //getDate(), 
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
            countable: newHabitForm.Countable,
            set_value: newHabitForm.Countable ? newHabitForm.Target : undefined,
            completed: []
            };  
        return habit;
    }  

    const renderSwitch = (param) => 
            {
            
            switch(param) {
                case 'Custom':
                    return (<>                
                            <Input value={newHabitForm.HabitName} onChangeText={(text)=> setNewHabitForm({...newHabitForm,HabitName:text})} inputContainerStyle={styles.inputTextBox.container}  style={styles.inputTextBox.box} placeholder="Habit name"/>
                            <Input value={newHabitForm.Description} onChangeText={(text)=> setNewHabitForm({...newHabitForm,Description:text})} inputContainerStyle={styles.inputTextBox.container}  style={styles.inputTextBox.box} maxLength={250} multiline = {true} placeholder="Description"/>
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
                            {/* MORE CUSTOMIZZATION HABIT
                            <RNPickerSelect
                                containerStyle={styles.dropdown.container}
                                useNativeAndroidPickerStyle={false}
                                style={styles.dropdown}
                                onValueChange={(value) => setNewHabitForm({...newHabitForm,Target_type:value})}
                                items={[{'label': 'Yes or no', 'value': 'bool'}, {'label': 'Numeric', 'value': 'numeric'}]}
                            /> 
                            {newHabitForm.Target_type=='numeric' &&
                            (<>
                                <Input value={newHabitForm.Target_name} onChangeText={(text)=> setNewHabitForm({...newHabitForm,Target_name:text})} inputContainerStyle={styles.inputTextBox.container}  style={styles.inputTextBox.box} maxLength={250} multiline = {true} placeholder="Target name es. steps, glass, km"/>
                                <Input value={newHabitForm.Target} onChangeText={(text)=> setNewHabitForm({...newHabitForm,Target:text})} inputContainerStyle={styles.inputTextBox.container}  style={styles.inputTextBox.box} keyboardType='number-pad' placeholder={"Insert target daily "+newHabitForm.Target_name}/>
                            </>)} */}
                            </>);
                case 'Drink':
                    //{setNewHabitForm({...newHabitForm, HabitName:param})};
                    return (<>                          
                            <Input value={newHabitForm.Target} onChangeText={(text)=> setNewHabitForm({...newHabitForm,Target:text})} inputContainerStyle={styles.inputTextBox.container}  style={styles.inputTextBox.box} keyboardType='number-pad' placeholder="Insert target daily glasses"/>
                            <View style={{flex:8, justifyContent: "space-around", flexDirection: "row"}}>
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
                            </View>
                            </>);
                case 'Walk':
                    {/* {(param) => setNewHabitForm({...newHabitForm, HabitName:param})} */}
                    return (<>                
                        <Input value={newHabitForm.Target} onChangeText={(text)=> setNewHabitForm({...newHabitForm,Target:text})} inputContainerStyle={styles.inputTextBox.container}  style={styles.inputTextBox.box} keyboardType='number-pad' placeholder="Insert target daily steps"/>
                        </>);   
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
                    style={styles.dropdown}
                    onValueChange={(value) => setNewHabitForm({...newHabitForm,Category:value})}
                    items={categories.map((num) => ({'label': num, 'value': num}))}
                />      
                {renderSwitch(newHabitForm.Category)}    
                </View>
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
                <View style={{alignItems: 'center'}}>
                    <CheckBox
                        title='Everyday'
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
                        containerStyle={styles.checkBox.container}
                        />
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
                                onPress={() => addHabit(uid, api_token, makeHabit())}
                            />
                        </TouchableOpacity> 
                </View>
        </View>
        )
    }   
}

export default NewHabit



