import * as Notifications from 'expo-notifications';
import store from './store';
import moment from 'moment'
import { getDate } from './support/Api';
import { initNotifDb, setNotifIds, setDate } from './slices/habitSlice';
import { weekDays } from './support/Api';

//init notification value
const getNotifContent = (habit) => {
  var title = "";
  var content = "";
  switch (habit.category) {
    case "Drink": {
      title = habit.category
      content = "It's time to Drink"
      break;
    }
    case "Walk": {
      title = habit.category
      content = "It's time to Walk"
      break;
    }
    case "Custom": {
      title = habit.name
      content = "Have you achieved your habit?"
      break;
    }
  }
  var data = [title, content]
  return data
}

//Schedule the notifications (it put the notifications between the rise and the sleep time by placing them equidistant from each other)
async function schedulePushNotification(rise_time, sleep_time, habit) {

  //set notifications features
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  var notifData = getNotifContent(habit);
  var notifIds = [];
  var upDays = 0;
  var rise = parseInt((rise_time).split(':')[0]) + 1;
  var sleep = parseInt((sleep_time).split(':')[0]) + 1;
  if (sleep < rise) {
    sleep = sleep + 24;
  }
  const hoursForNotifications = parseInt((sleep - rise) / habit.reminder);
  var startDate = new Date(Date.now());

  for (let d = 0; d < 7; d++) {

    if (habit.repeat_days[weekDays[startDate.getDay()]]) {
      startDate.setHours(rise);
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      upDays++;

      for (let i = 0; i < habit.reminder; i++) {
        var trigger = startDate.setHours(rise + 1 + hoursForNotifications * i);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: notifData[0],
            body: notifData[1],
            data: { data: 'goes here' },
          },
          trigger,
        })
          .then((scheduleId) => {
            notifIds.push(scheduleId);
          });
      }
    }
    startDate.setDate(startDate.getDate() + 1);
  }
  store.dispatch(setNotifIds({ id: habit.id, not_ids: notifIds, notify_num: habit.reminder * upDays }));
}

//Handle call to notification scheduler (it call schedulePushNotification if 3 days have passed since the last call)
async function scheduleHabitNotification(habit, rise_time, sleep_time, notifDB) {
  today = moment(getDate());

  if (notifDB == undefined) store.dispatch(initNotifDb());

  if (notifDB[habit.id] == undefined) {

    await schedulePushNotification(rise_time, sleep_time, habit);
  }
  else {
    last_date = moment(notifDB[habit.id].date)
    if (today.diff(last_date, 'days') >= 3) {
      for (let notId of notifDB[habit.id].ids) {
        Notifications.cancelScheduledNotificationAsync(notId)
      }
      await schedulePushNotification(rise_time, sleep_time, habit)
    }

  }
}

//delete notifications just for an habit
async function deleteHabitNotification(id, notifDB, habit) {
  if (notifDB != undefined) {
    if (notifDB[habit.id] != undefined) {
      for (let notId of notifDB[id].ids) {
        Notifications.cancelScheduledNotificationAsync(notId)
      }
      store.dispatch(setDate({ id: id, date: "2020-12-12" }));
    }
  }
}

//retrieve all the notifications
async function getNotification() {
  Notifications.getAllScheduledNotificationsAsync()
}

//delete all the notifications
async function cancelAllNot() {
  Notifications.cancelAllScheduledNotificationsAsync();
  store.dispatch(initNotifDb())
}



export { schedulePushNotification, scheduleHabitNotification, getNotification, cancelAllNot, deleteHabitNotification }