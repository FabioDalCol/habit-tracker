import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Input, CheckBox} from 'react-native-elements';
import { ScreenContainer } from 'react-native-screens';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { styles } from '../styles';
import { add } from 'react-native-reanimated';
import { useState } from 'react';
import { useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';


const NewHabit = (props ) => {

  
    
    const {newHabitForm, setNewHabitForm}=props.state;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const categories= ['Drink', 'Run', 'Diet', 'Sport', 'Walk', 'Health'];

    
    console.log(categories.map((num) => ({'label': num, 'value': num})));


    console.log(newHabitForm);


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
                    onValueChange={(value) => console.log(value)}
                    items={categories.map((num) => ({'label': num, 'value': num}))}

                />
                <Input value={newHabitForm.HabitName} onChangeText={(text)=> setNewHabitForm({...newHabitForm,HabitName:text})} inputContainerStyle={styles.inputTextBox.container}  style={styles.inputTextBox.box} placeholder="Habit name"/>
                <Input inputContainerStyle={styles.inputTextBox.container}  style={styles.inputTextBox.box} maxLength={250} multiline = {true} placeholder="Description/Target"/>
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
                                onPress={()=>add()}                
                            />
                        </TouchableOpacity> 
                </View>
        </View>
        )
    }   
}

export default NewHabit



