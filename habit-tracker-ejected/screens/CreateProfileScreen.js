import React, { useState, useEffect } from 'react'
import { View, Text, BackHandler } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { styleColors } from '../colors';
import { styles } from '../styles';
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import store from '../store';
import { useSelector } from 'react-redux';
import { selectUser, setProfile, selectProfile } from '../slices/authSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { updateUserProfile } from '../support/Api';

const RootProfile = () => {

    const user = useSelector(selectUser);
    const navigation = useNavigation();
    const profile = useSelector(selectProfile);

    //if profile already exists, fields are initialized with profile data
    const [name, setName] = useState(profile.username?.length > 1 ? profile.username : user.fullname?.split(/(\s+)/)[0])
    const [age, setAge] = useState(profile.age > 0 ? profile.age : 30)
    const [height, setHeight] = useState(parseInt(profile.height) > 0 ? profile.height : "170")
    const [activePage, setActivePage] = useState(0)
    var sleep_time, rise_time;

    const [timePicker, setTimePicker] = useState({ Mode: "time", Date_start: new Date(Date.now()), Date_end: new Date(Date.now()), Show_end: false, Show_start: false, Picker_value: 'vuoto' })

    const DotsSlider = () => {
        return (
            <View style={{ flexDirection: "row", paddingBottom: 80 }}>
                {[...Array(4)].map((index, value) =>
                    <MaterialCommunityIcons
                        key={value}
                        name="circle" //
                        size={10}
                        style={[styles.plusButton, { color: value == activePage ? styleColors.themeColor : styleColors.greyish, backgroundColor: styleColors.white }]}
                    />
                )}
            </View>
        )
    }

    const makeTwoDigits = (time) => {  //format hours with two digits
        const timeString = `${time}`;
        if (timeString.length === 2) return time
        return `0${time}`
    }

    const HoursPicker = () => {

        //time picker helper functions
        const onChange_start = (event, selectedDate) => {
            const currentDate = selectedDate || timePicker.Date_start;
            setTimePicker({ ...timePicker, Show_start: false, Date_start: currentDate });
        };
        const onChange_end = (event, selectedDate) => {
            const currentDate = selectedDate || timePicker.Date_end;
            setTimePicker({ ...timePicker, Show_end: false, Date_end: currentDate });
        };
        const showTimepicker_start = () => {
            setTimePicker({ ...timePicker, Show_start: true, Mode: 'time' });
        };
        const showTimepicker_end = () => {
            setTimePicker({ ...timePicker, Show_end: true, Mode: 'time' });
        };

        return (
            <View style={{ flexDirection: "row" }}>
                <View>
                    <TouchableOpacity style={styles.timePicker.timeButton} onPress={showTimepicker_start} >
                        <Text style={styles.timePicker.text}>Rise time</Text>
                        <Text style={styles.timePicker.hour}>{makeTwoDigits(timePicker.Date_start.getHours()) + ':' + makeTwoDigits(timePicker.Date_start.getMinutes())}</Text>
                    </TouchableOpacity>
                </View>

                {timePicker.Show_start && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={timePicker.Date_start}
                        mode={timePicker.Mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange_start}
                    />
                )}

                <View>
                    <Pressable style={styles.timePicker.timeButton} onPress={showTimepicker_end} >
                        <Text style={styles.timePicker.text}>Sleep time</Text>
                        <Text style={styles.timePicker.hour}>{makeTwoDigits(timePicker.Date_end.getHours()) + ':' + makeTwoDigits(timePicker.Date_end.getMinutes())}</Text>
                    </Pressable>
                </View>

                {timePicker.Show_end && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={timePicker.Date_end}
                        mode={timePicker.Mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange_end}
                    />
                )}

            </View>
        )
    }

    useEffect(() => {                //updates dotslider and handles back button press
        const backAction = () => {
            if (activePage > 0) {
                setActivePage(activePage - 1)
            }
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [activePage]);

    return (<>
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={styles.profile.container}>
                <DotsSlider />
                {activePage == 0 ? (<>
                    <Text style={{ fontSize: 32, fontWeight: "700", textAlign: "center", paddingBottom: 30 }} >How should I call you?</Text>
                    <Input style={{ textAlign: "center" }} placeholder="Name" value={name} onChangeText={(text) => setName(text)} />
                    <Button buttonStyle={styles.button} disabled={name?.length < 2} disabledStyle={{ backgroundColor: styleColors.background }} TouchableComponent={TouchableOpacity} onPress={() => { setActivePage(activePage + 1) }} title="Next" />
                </>)
                    : activePage == 1 ? (<>
                        <Text style={{ fontSize: 32, fontWeight: "700", textAlign: "center", paddingBottom: 30 }} >How old are you?</Text>
                        <Input keyboardType="numeric" style={{ textAlign: "center" }} placeholder="Age" value={String(age)} onChangeText={(text) => setAge(text)} />
                        <Button buttonStyle={styles.button} disabled={age < 12} disabledStyle={{ backgroundColor: styleColors.background }} TouchableComponent={TouchableOpacity} onPress={() => { setActivePage(activePage + 1) }} title="Next" />
                    </>)
                        : activePage == 2 ? (<>
                            <Text style={{ fontSize: 32, fontWeight: "700", textAlign: "center", paddingBottom: 30 }} >How tall are you?</Text>
                            <Input style={{ textAlign: "center" }} placeholder="Height" keyboardType="numeric" value={height} onChangeText={(text) => setHeight(text)} />
                            <Button buttonStyle={styles.button} disabled={height.length <= 2} disabledStyle={{ backgroundColor: styleColors.background }} TouchableComponent={TouchableOpacity} onPress={() => { setActivePage(activePage + 1) }} title="Next" />
                        </>)
                            : (<>
                                <Text style={{ fontSize: 32, fontWeight: "700", textAlign: "center", paddingBottom: 30 }} >When would you like to receive your reminders?</Text>
                                <HoursPicker />
                                <Button buttonStyle={styles.button} TouchableComponent={TouchableOpacity}
                                    onPress={async () => {
                                        const edit = profile.username != ""
                                        rise_time = makeTwoDigits(timePicker.Date_start.getHours()) + ':' + makeTwoDigits(timePicker.Date_start.getMinutes());
                                        sleep_time = makeTwoDigits(timePicker.Date_end.getHours()) + ':' + makeTwoDigits(timePicker.Date_end.getMinutes())
                                        let diz = {
                                            username: name,
                                            height: height,
                                            age: age,
                                            rise_time: rise_time,
                                            sleep_time: sleep_time,
                                        };
                                        store.dispatch(setProfile(diz));
                                        await updateUserProfile(user.uid, user.api_token, diz)
                                        if (edit) navigation.navigate('Root')
                                    }}
                                    title="Let's start" />
                            </>)}
            </View>
        </SafeAreaView>
    </>)

}

export default RootProfile
