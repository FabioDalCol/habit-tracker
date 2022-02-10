import React from 'react'
import { View, Text, Platform, ToastAndroid } from 'react-native'
import { Input, CheckBox } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from '../styles';
import { useEffect } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { addHabit, getDate, updateHabit } from "../support/Api";
import { selectHabits } from '../slices/habitSlice';
import { useSelector } from 'react-redux';


const NewHabit = (props) => {

    const uid = props.uid;
    const api_token = props.api_token;
    const { newHabitForm, setNewHabitForm } = props.state;
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const categories = ['Drink', 'Walk', 'Custom'];

    //Pick a default description for Drink and Walk and pick a custom description for Custom's category habit
    const pickDescription = () => {
        switch (newHabitForm.Category) {
            case "Custom":
                return newHabitForm.Description;
            case "Drink":
                return "Stay hydrated";
            case "Walk":
                return "Get fit";
        }
    }

    //Prepare the habit to send to firestore db
    const makeHabit = (create) => {
        var habit = {
            name: newHabitForm.Category == 'Custom' ? newHabitForm.HabitName : newHabitForm.Category,
            desc: pickDescription(),
            category: newHabitForm.Category,
            created: create ? getDate() : newHabitForm.created,
            repeat_days: {
                Thu: newHabitForm.Thu,
                Fri: newHabitForm.Fri,
                Sat: newHabitForm.Sat,
                Wed: newHabitForm.Wed,
                Sun: newHabitForm.Sun,
                Tue: newHabitForm.Tue,
                Mon: newHabitForm.Mon
            },
            value: create ? 0 : newHabitForm.Value,
            countable: newHabitForm.Category != 'Custom',
            set_value: pickTarget(newHabitForm.Category),
            reminder: newHabitForm.Reminder ? newHabitForm.Times : 0,
            is_active: true,
        };
        if (!newHabitForm.Reminder)
            setNewHabitForm({ ...newHabitForm, Times: 0 });
        if (newHabitForm.Category == 'Walk')
            habit['pedometer'] = newHabitForm.Pedometer;
        console.log(habit);
        return habit;
    }

    //Reset all fields of newHabitForm
    const fieldclear = () => {
        setNewHabitForm({ Category: undefined, HabitName: '', desc: '', Walk_target: '10000', Drink_target: '10', Times: 0, Pedometer: true, Reminder: false, Target_name: '', Mode: 'time', Date_start: new Date(1598051730000), Date_end: new Date(1598051730000), Show_end: false, Show_start: false, Picker_value: 'vuoto', Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false, Eve: false })
    }

    const pickTarget = (param) => {
        switch (param) {
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

    //Return a right form for the picked category
    const renderSwitch = (param) => {

        switch (param) {
            case 'Custom':
                return (<>
                    <Input value={newHabitForm.HabitName} onChangeText={(text) => setNewHabitForm({ ...newHabitForm, HabitName: text })} inputContainerStyle={styles.inputTextBox.container} style={styles.inputTextBox.box} placeholder="Habit name" />
                    <Input value={newHabitForm.Description} onChangeText={(text) => setNewHabitForm({ ...newHabitForm, Description: text })} inputContainerStyle={styles.inputTextBox.container} style={styles.inputTextBox.box} maxLength={250} multiline={true} placeholder="Description" />
                </>);
            case 'Drink':
                return (<>
                    <View style={[styles.centredBlock, { marginLeft: 'auto' }]}>
                        <View style={{ flex: 0.5, }}>
                            <Input inputContainerStyle={[styles.inputTextBox.container, { alignSelf: 'flex-end', width: 30 + String(newHabitForm.Drink_target).length * 10 }]} style={styles.inputTextBox.box} value={newHabitForm.Drink_target.toString()} onChangeText={(text) => setNewHabitForm({ ...newHabitForm, Drink_target: text })} keyboardType='number-pad' />
                        </View>
                        <View style={{ flex: 0.5 }}>
                            <Text style={styles.targetLabel}>Glasses</Text>
                        </View>
                    </View>
                </>);
            case 'Walk':
                return (<>
                    <View style={[styles.centredBlock, { marginBottom: '-5%' }]}>
                        <View>
                            <Input inputContainerStyle={[styles.inputTextBox.container, { alignSelf: 'flex-end', width: 30 + String(newHabitForm.Walk_target).length * 10 }]} style={styles.inputTextBox.box} value={newHabitForm.Walk_target.toString()} onChangeText={(text) => setNewHabitForm({ ...newHabitForm, Walk_target: text })} keyboardType='number-pad' />
                        </View>
                        <View>
                            <Text style={styles.targetLabel}>Steps</Text>
                        </View>
                    </View>
                    <View style={[styles.centredBlock, { marginBottom: '5%' }]}>
                        <View>
                            <CheckBox
                                iconRight
                                iconType='material'
                                checked={newHabitForm.Pedometer}
                                onPress={() => setNewHabitForm({ ...newHabitForm, Pedometer: !newHabitForm.Pedometer })}
                                checkedIcon='check-circle-outline'
                                uncheckedIcon='radio-button-unchecked'
                                containerStyle={[styles.checkBoxDays.container]}
                            />
                        </View>
                        <View>
                            <Text style={styles.pedometerLabel}>Pedometer</Text>
                        </View>
                    </View>
                </>);
            default:
                return null;
        }
    }

    //return checkbox common for both the forms
    const renderForm = () => {
        return (<>
            <View style={styles.checkboxContainer}>
                <View style={styles.centredCheck}>
                    <Text style={styles.checkboxLabel}>Mon</Text>
                    <CheckBox
                        iconRight
                        iconType='material'
                        checked={newHabitForm.Mon}
                        onPress={() => setNewHabitForm({ ...newHabitForm, Mon: !newHabitForm.Mon })}
                        checkedIcon='check-circle-outline'
                        uncheckedIcon='radio-button-unchecked'
                        containerStyle={styles.checkBoxDays.container}
                    />
                </View>
                <View style={styles.centredCheck}>
                    <Text style={styles.checkboxLabel}>Tue</Text>
                    <CheckBox
                        iconRight
                        iconType='material'
                        checked={newHabitForm.Tue}
                        onPress={() => setNewHabitForm({ ...newHabitForm, Tue: !newHabitForm.Tue })}
                        checkedIcon='check-circle-outline'
                        uncheckedIcon='radio-button-unchecked'
                        containerStyle={styles.checkBoxDays.container}
                    />
                </View>
                <View style={styles.centredCheck}>
                    <Text style={styles.checkboxLabel}>Wed</Text>
                    <CheckBox
                        iconRight
                        iconType='material'
                        checked={newHabitForm.Wed}
                        onPress={() => setNewHabitForm({ ...newHabitForm, Wed: !newHabitForm.Wed })}
                        checkedIcon='check-circle-outline'
                        uncheckedIcon='radio-button-unchecked'
                        containerStyle={styles.checkBoxDays.container}
                    />
                </View>
                <View style={styles.centredCheck}>
                    <Text style={styles.checkboxLabel}>Thu</Text>
                    <CheckBox
                        iconRight
                        iconType='material'
                        checked={newHabitForm.Thu}
                        onPress={() => setNewHabitForm({ ...newHabitForm, Thu: !newHabitForm.Thu })}
                        checkedIcon='check-circle-outline'
                        uncheckedIcon='radio-button-unchecked'
                        containerStyle={styles.checkBoxDays.container}
                    />
                </View>
                <View style={styles.centredCheck}>
                    <Text style={styles.checkboxLabel}>Fri</Text>
                    <CheckBox
                        iconRight
                        iconType='material'
                        checked={newHabitForm.Fri}
                        onPress={() => setNewHabitForm({ ...newHabitForm, Fri: !newHabitForm.Fri })}
                        checkedIcon='check-circle-outline'
                        uncheckedIcon='radio-button-unchecked'
                        containerStyle={styles.checkBoxDays.container}
                    />
                </View>
                <View style={styles.centredCheck}>
                    <Text style={styles.checkboxLabel}>Sat</Text>
                    <CheckBox
                        iconRight
                        iconType='material'
                        checked={newHabitForm.Sat}
                        onPress={() => setNewHabitForm({ ...newHabitForm, Sat: !newHabitForm.Sat })}
                        checkedIcon='check-circle-outline'
                        uncheckedIcon='radio-button-unchecked'
                        containerStyle={styles.checkBoxDays.container}
                    />
                </View>
                <View style={styles.centredCheck}>
                    <Text style={styles.checkboxLabel}>Sun</Text>
                    <CheckBox
                        iconRight
                        iconType='material'
                        checked={newHabitForm.Sun}
                        onPress={() => setNewHabitForm({ ...newHabitForm, Sun: !newHabitForm.Sun })}
                        checkedIcon='check-circle-outline'
                        uncheckedIcon='radio-button-unchecked'
                        containerStyle={styles.checkBoxDays.container}
                    />
                </View>
            </View>
            <View style={styles.halfCentred}>
                <Text style={styles.checkboxLabel}>Everyday</Text>
                <CheckBox
                    //title='Everyday'
                    iconRight
                    iconType='material'
                    checked={newHabitForm.Eve}
                    onPress={() => {
                        let diz = {};
                        for (var key of days) {
                            diz[key] = !newHabitForm['Eve'];
                        }
                        setNewHabitForm({ ...newHabitForm, ...diz, Eve: !newHabitForm['Eve'] });
                    }}
                    checkedIcon='check-circle-outline'
                    uncheckedIcon='radio-button-unchecked'
                    containerStyle={styles.checkBoxDays.container}
                />
            </View>

            <View style={styles.centredBlock}>
                <View style={[styles.halfCentred, { flexDirection: 'row', marginLeft: !newHabitForm.Reminder ? '-14%' : 0 }]}>
                    <Text style={styles.reminder}>Reminder</Text>
                    <CheckBox
                        iconRight
                        iconType='material'
                        checked={newHabitForm.Reminder}
                        onPress={() => setNewHabitForm({ ...newHabitForm, Reminder: !newHabitForm.Reminder })}
                        checkedIcon='check-circle-outline'
                        uncheckedIcon='radio-button-unchecked'
                        containerStyle={[styles.checkBoxDays.container]}
                    />
                </View>
                {newHabitForm.Reminder && (<View style={styles.reminderPicker}>
                    <RNPickerSelect
                        containerStyle={styles.dropdown.container}
                        useNativeAndroidPickerStyle={false}
                        style={styles.dropdown}
                        value={newHabitForm.Times}
                        onValueChange={(value) => setNewHabitForm({ ...newHabitForm, Times: value })}
                        items={[0, 1, 2, 3, 4, 6].map((num) => ({ 'label': num + " volte", 'value': num }))}
                        placeholder={{
                            label: 'Number of daily reminders',
                            value: null,
                        }}

                    />
                </View>
                )}
            </View>

        </>)
    }

    //Set everiday checkbox at true if all days are checked
    useEffect(() => {
        var sum = true;
        for (var d of days) {
            sum = sum * newHabitForm[d]
        }
        setNewHabitForm({ ...newHabitForm, Eve: sum })
    }, [newHabitForm.Mon, newHabitForm.Tue, newHabitForm.Wed, newHabitForm.Thu, newHabitForm.Fri, newHabitForm.Sat, newHabitForm.Sun])

    //Handle shows of form
    if (props.show == false) {
        return (null)
    }

    else {
        //To select the right form for the screen (habit list or home)
        if (!newHabitForm.Habit_list) {
            return (
                <View style={props.viewStyle}>
                    <View style={{ justifyContent: 'center' }}>
                        <RNPickerSelect
                            containerStyle={styles.dropdown.container}
                            useNativeAndroidPickerStyle={false}
                            style={styles.dropdownCategory}
                            onValueChange={(value) => setNewHabitForm({ ...newHabitForm, Category: value })}
                            items={categories.map((num) => ({ 'label': num, 'value': num }))}
                            placeholder={{
                                label: 'Select a category',
                                value: null,
                            }}
                        />
                        {renderSwitch(newHabitForm.Category)}
                    </View>
                    {newHabitForm.Category != undefined && (<>
                        {renderForm()}
                        <View style={styles.newHabitForm}>
                            <TouchableOpacity style={{ flex: 1 }}>
                                <MaterialCommunityIcons
                                    name="trash-can"
                                    size={30}
                                    style={styles.redIcon}
                                    onPress={() => props.setShow(false)}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style={{ flex: 1 }}>
                                <MaterialCommunityIcons
                                    name="send"
                                    size={30}
                                    style={{ color: '#4263ec' }} // da rivedere perchè non responsive 
                                    onPress={() => { addHabit(uid, api_token, makeHabit(true)); props.setShow(false); ToastAndroid.show("Habit added !", ToastAndroid.SHORT); fieldclear() }}
                                />
                            </TouchableOpacity>
                        </View>
                    </>)}
                </View>
            )
        }


        //FOR HABIT LIST

        else {
            return (
                <View style={props.viewStyle}>
                    <View style={{ justifyContent: 'center' }}>
                        {renderSwitch(newHabitForm.Category)}
                    </View>
                    {newHabitForm.Category != undefined && (<>
                        {renderForm()}
                        <View style={styles.newHabitForm}>
                            <TouchableOpacity style={{ flex: 1 }}>
                                <MaterialCommunityIcons
                                    name="window-minimize"
                                    size={30}
                                    style={styles.redIcon}
                                    onPress={() => props.setShow(false)}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity style={{ flex: 1 }}>
                                <MaterialCommunityIcons
                                    name="send"
                                    size={30}
                                    style={{ color: '#4263ec' }}
                                    onPress={() => { updateHabit(uid, api_token, makeHabit(false), newHabitForm.id); props.setShow(false); ToastAndroid.show("Habit updated !", ToastAndroid.SHORT); }}
                                />
                            </TouchableOpacity>
                        </View>
                    </>)}
                </View>
            )
        }
    }
}

export default NewHabit



