import * as React from "react";
import { View, Text, RefreshControl, StatusBar, NativeModules, NativeEventEmitter } from "react-native";
import { useFirstRender } from "../support/useFirstRender";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import store from "../store";
import { selectUser, selectProfile } from "../slices/authSlice";
import { selectHabits, selectNotifDB } from "../slices/habitSlice";
import { initDay, setValue, pushValue } from "../slices/habitSlice";
import tailwind from "tailwind-rn";
import { styles } from "../styles";
import { styleColors } from '../colors'
import NewHabit from "../components/NewHabit";
import Habit from "../components/Habit";
import HomeHeader from "../components/HomeHeader";
import getHabits, { countCompletedHabits, getDate, getTodayHabits, weekDays, getOnlyHabit, walkTodayPed } from "../support/Api";
import { scheduleHabitNotification } from "../NotificationHandler"

const { RNWalkCounter } = NativeModules;
const WalkEvent = new NativeEventEmitter({ RNWalkCounter }); //connects to native pedometer

export const useDebouncedEffect = (effect, deps, delay) => { //debounce custom hook
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);
    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
};

const HomeScreen = () => {

  const scrollRef = useRef();
  const onPressAdd = () => {          //when adding a new habit scrolls up the scrollview
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  const user = useSelector(selectUser);
  const uid = user.uid
  const api_token = user.api_token;
  const profile = useSelector(selectProfile);
  const notifDB = useSelector(selectNotifDB)
  const [debounce, setDebounce] = useState(0);
  const firstRender = useFirstRender();

  function useStateRef(initialValue) {   //pedometer referer to update steps in the callback
    const [value, setValue] = useState(initialValue);
    const ref = useRef(value);
    useEffect(() => {
      ref.current = value;
    }, [value]);

    return [value, setValue, ref];
  }

  const [stepsval, setStepsVal, stepsRef] = useStateRef(0)
  const [steps, setSteps] = useState(0);

  useEffect(() => {   //fetch habits from API on first page load
    getHabits(uid, api_token, {})
  }, [])

  const [showView, setShowView] = useState(false);
  const [newHabitForm, setNewHabitForm] = useState({ Walk_target: '10000', Drink_target: '10', Times: 0, Pedometer: false, Reminder: false, HabitName: '', Target_name: '', Mode: 'time', Date_start: new Date(1598051730000), Date_end: new Date(1598051730000), Show_end: false, Show_start: false, Picker_value: 'vuoto', Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false, Eve: false })
  const [refreshing, setRefreshing] = useState(false); //pull down to refresh   

  const setNewHabitComp = () => {
    setShowView(!showView)
  }
  const newhabits = useSelector(selectHabits);

  useEffect(() => {                   //initialize stats and notifications
    if (newhabits != undefined && !firstRender) {
      store.dispatch(initDay({ uid: uid, token: api_token }))
      for (let habit of newhabits) {
        if (habit.reminder > 0 && habit.is_active) {
          scheduleHabitNotification(habit, profile.rise_time, profile.sleep_time, notifDB);
        }
      }
    }
  }, [newhabits, firstRender])

  useEffect(() => {                                                 //Start pedometer
    const default_threshold = 35.0;
    const default_delay = 150000000;
    WalkEvent.addListener('onStepRunning', (event) => {
      setStepsVal(stepsRef.current + 1)
    })
    RNWalkCounter.startCounter(default_threshold, default_delay)
    return () => RNWalkCounter.stopCounter()
  }, [])

  useEffect(() => {                               //Increment steps in "walk" habits
    const walkIds = walkTodayPed(newhabits)
    if (walkIds.length > 0 && !firstRender) {
      for (id of walkIds) {
        var prev = getOnlyHabit(newhabits, id).value
        setSteps(steps + 1)
        store.dispatch(setValue({ id: id, date: getDate(), value: (parseInt(prev) + 1) }));
        if (steps >= 50) {
          store.dispatch(pushValue({ id: id, uid: uid, token: api_token }))
          setSteps(0)
        }
      }
    }
  }, [stepsval, firstRender])

  useDebouncedEffect(() => {
    if (debounce.id != undefined)
      store.dispatch(pushValue({ id: debounce.id, uid: uid, token: api_token }))
  }, [debounce], 1000); //debounce updates to limit api calls

  var todayHabits = getTodayHabits(newhabits);
  var completedHabitsCount = countCompletedHabits(todayHabits, newhabits);

  const dailyProgressColor = () => {    //progress bar colors 
    if (completedHabitsCount / todayHabits.length < 1 / 2) {
      return { backgroundColor: styleColors.pbRed }
    }
    if (completedHabitsCount / todayHabits.length < 1) {
      return { backgroundColor: styleColors.pbOrange }
    }
    else {
      return { backgroundColor: styleColors.greenComp }
    }
  }

  const repeatDays = (activeDays) => {  //gets habit active days caption
    var days = ""
    for (var day of weekDays) {
      if (activeDays[day]) {
        days = days + day + ", "
      }
    }
    days = days.slice(0, -2);
    return days
  }

  return (
    <View style={[tailwind('flex-1'), { backgroundColor: styleColors.themeColor }]} >
      <StatusBar barStyle="light-content" backgroundColor={styleColors.themeColor} />
      <HomeHeader />
      <View style={tailwind('py-0 px-4')}>
        <Text style={[tailwind('text-4xl'), { color: styleColors.white }]}>
          Hi,{"\n" + profile.username}
        </Text>
      </View>

      <View style={styles.infoBox} >
        <Text style={tailwind('text-2xl pb-4 ')}>Progress</Text>
        <View style={tailwind(" h-8 relative max-w-xl rounded-full overflow-hidden")}>
          <View style={tailwind("w-full h-full bg-gray-200 absolute")}>
            <View style={[tailwind(" h-full absolute"), dailyProgressColor(), { width: completedHabitsCount / todayHabits.length * 100 + "%" }]}></View>
            <View style={tailwind("flex-1 justify-center")}>
              <Text style={tailwind("text-center text-base font-semibold")}> {completedHabitsCount} of {todayHabits.length}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.habitBox}>
        <Text style={tailwind('text-2xl')}>Daily Habits</Text>
        <TouchableOpacity onPress={() => {
          setNewHabitComp();
          onPressAdd();
        }}>
          <MaterialCommunityIcons
            name="plus" //
            size={40}
            style={[{ color: styleColors.themeColor, backgroundColor: styleColors.white }, styles.plusButton]}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView.home}
        contentContainerStyle={{ paddingBottom: 20 }}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              getHabits(uid, api_token, {}, setRefreshing)
            }
            }
          />}>

        <NewHabit viewStyle={styles.newHabit} show={showView} state={{ newHabitForm, setNewHabitForm }} setShow={setNewHabitComp} uid={uid} api_token={api_token} />

        {newhabits?.map(habit =>
        (getTodayHabits(newhabits)?.includes(habit.id) && (
          <Habit
            key={habit.id}
            id={habit.id}
            name={habit.name}
            category={habit.category}
            desc={(repeatDays(habit.repeat_days).split(',').length > 6) ? 'Everyday' : repeatDays(habit.repeat_days)}
            countable={habit.countable}
            value={habit.value}
            set_value={habit.set_value}
            completeToday={habit.stats != undefined ? habit.stats[getDate()]?.completed : false}
            date={getDate()}
            pedometer={habit.pedometer}
            debounce={debounce}
            setDebounce={setDebounce}
          />
        )
        )
        )}
      </ScrollView>
    </View>
  );
}

export default HomeScreen;