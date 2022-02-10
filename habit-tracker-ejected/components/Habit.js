import React, { useState, useEffect } from 'react'
import { View, Text, Alert, ToastAndroid } from 'react-native'
import { styles } from '../styles';
import { styleColors } from '../colors';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tailwind from 'tailwind-rn';
import store from '../store';
import { incrementValue, decrementValue, setValue, triggerCompleted, pushValue, setIsActive, selectHabits, selectNotifDB } from '../slices/habitSlice';
import { useSelector } from 'react-redux';
import { selectUser } from '../slices/authSlice';
import { removeHabit } from '../support/Api';
import NewHabit from "../components/NewHabit";
import { useNavigation } from '@react-navigation/native';
import { deleteHabitNotification } from '../NotificationHandler'

const categories = {
  Drink: { icon: "cup-water", color: styleColors.water },
  Walk: { icon: "walk", color: "brown" },
  Custom: { icon: "chess-queen", color: styleColors.custom[Math.floor(Math.random() * styleColors.custom.length)] }
}

const Habit = ({ id, name = 'Default', date, category, desc, countable, value = null, set_value = null, completeToday, manage_habits = false, is_active, created, show = false, habitToEdit, setHabitToEdit, times, reminder, mon, tue, wed, thu, fri, sat, sun, pedometer = null, debounce = debounce, setDebounce = setDebounce }) => {

  const habits = useSelector(selectHabits);
  const user = useSelector(selectUser);
  const notifDB = useSelector(selectNotifDB);
  const navigation = useNavigation();
  const uid = user.uid
  const api_token = user.api_token;


  const [newHabitForm, setNewHabitForm] = useState({ id: id, Habit_list: true, Description: desc, HabitName: name, Category: category, Walk_target: set_value, Drink_target: set_value, Times: times, Reminder: reminder, Mon: mon, Tue: tue, Wed: wed, Thu: thu, Fri: fri, Sat: sat, Sun: sun, Eve: false, created: created, Pedometer: pedometer, Value: value })

  const setShowView = (param) => {
    if (!param) {
      setHabitToEdit(-1);
    }
  };

  const deleteConfirm = () =>
    Alert.alert(
      "Remove Habit",
      "Are you sure you want to delete this habit?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            removeHabit(uid, api_token, id);
            const index = habits.findIndex(habit => habit.id == id);
            if (reminder)
              deleteHabitNotification(id, notifDB, habits[index]);
            ToastAndroid.show("Habit removed !", ToastAndroid.SHORT);
          }
        }
      ]
    );

  useEffect(() => {
    setNewHabitForm({ id: id, Habit_list: true, Description: desc, HabitName: name, Category: category, Walk_target: set_value, Drink_target: set_value, Times: times, Reminder: reminder, Mon: mon, Tue: tue, Wed: wed, Thu: thu, Fri: fri, Sat: sat, Sun: sun, Eve: tue * wed * mon * thu * sun * fri * sat, created: created, Pedometer: pedometer, Value: value })
  }, [habits])



  if (!manage_habits) {  //Home screen habits
    return (
      <View style={[styles.habit.main, completeToday ? styles.habit.completed : {}]} >

        <View style={styles.habit.container}>
          <MaterialCommunityIcons
            name={categories[category].icon}
            size={30}
            style={{ color: categories[category].color, marginRight: 5 }}
          />
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('Detail', { id: id })}>
              <Text style={tailwind('text-base')}>{name}</Text>
            </TouchableOpacity>
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
                  style={[styles.inputValueBox, { width: 15 + String(value).length * 10 }]}
                  value={String(value)}
                  onChangeText={(text) => store.dispatch(setValue({ id: id, value: text, date: date }))}
                  onEndEditing={() => store.dispatch(pushValue({ id: id, uid: uid, token: api_token }))}
                />
              </View>
              <Text style={[tailwind("text-center font-semibold"), { fontSize: 18 }]}>/{set_value}</Text>
            </View>

            <View style={tailwind('flex-row justify-end pt-1')}>
              <TouchableOpacity onPress={() => { setDebounce({ id: id, debounce: (debounce + 1) }); store.dispatch(incrementValue({ id: id, uid: uid, token: api_token, date: date })) }} >
                <MaterialCommunityIcons
                  name="plus-circle-outline"
                  size={25}
                  style={{ color: categories[category].color }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setDebounce({ id: id, debounce: (debounce - 1) }); store.dispatch(decrementValue({ id: id, uid: uid, token: api_token, date: date })) }} >
                <MaterialCommunityIcons
                  name="minus-circle-outline"
                  size={25}
                  style={{ color: categories[category].color, marginLeft: 5 }}
                />
              </TouchableOpacity>
            </View>
          </>
          )
            : (<>
              <View style={tailwind('pr-4 ')}>
                <TouchableOpacity onPress={() => store.dispatch(triggerCompleted({ id: id, uid: uid, token: api_token, date: date }))}>
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
  else {  //Manage habit screen
    return (
      <View>
        <View style={styles.habit.main}>
          <View style={styles.habit.container}>
            <MaterialCommunityIcons
              name={categories[category].icon}
              size={30}
              style={{ color: categories[category].color, marginRight: 5 }}
            />
            <View>
              <Text style={tailwind('text-base')}>{name}</Text>
              {category == 'Drink' ?
                (
                  <Text style={{ color: styleColors.greyish }}>{'Target: ' + set_value + ' glasses'}</Text>)
                :
                (category == 'Walk' ?
                  (<Text style={{ color: styleColors.greyish }}>{'Target: ' + set_value + ' steps'}</Text>)
                  :
                  (<Text style={{ color: styleColors.greyish }}>{desc}</Text>)
                )
              }
              <Text style={{ color: styleColors.greyish }}>{'Created: ' + created}</Text>
            </View>
          </View>
          <View style={tailwind('flex-row')}>
            {is_active ?
              (<>
                <TouchableOpacity>
                  <MaterialCommunityIcons
                    name="stop"
                    size={30}
                    style={{ color: categories[category].color, marginRight: 5 }}
                    onPress={() => {
                      store.dispatch(setIsActive({ id: id, uid: uid, token: api_token }));
                      const index = habits.findIndex(habit => habit.id == id);
                      if (reminder)
                        deleteHabitNotification(id, notifDB, habits[index]);
                      ToastAndroid.show("Habit paused !", ToastAndroid.SHORT);
                    }}
                  />
                </TouchableOpacity>
              </>) :
              (<>
                <TouchableOpacity>
                  <MaterialCommunityIcons
                    name="play"
                    size={30}
                    style={{ color: categories[category].color, marginRight: 5 }}
                    onPress={() => {
                      store.dispatch(setIsActive({ id: id, uid: uid, token: api_token }));
                      ToastAndroid.show("Habit restored !", ToastAndroid.SHORT);
                    }}
                  />
                </TouchableOpacity>
              </>)}
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="pencil"
                size={30}
                style={{ color: categories[category].color }}
                onPress={() => { id == habitToEdit ? setHabitToEdit(-1) : setHabitToEdit(id) }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="trash-can"
                size={30}
                style={{ color: categories[category].color, marginLeft: 5 }}
                onPress={() => { deleteConfirm() }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {show &&
          (<>
            <NewHabit show={true} setShow={setShowView} viewStyle={styles.newHabit} state={{ newHabitForm, setNewHabitForm }} uid={uid} api_token={api_token} />
          </>)}
      </View>
    )
  }
};

export default Habit
