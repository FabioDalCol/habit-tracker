import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import store from './store';
import { useSelector } from 'react-redux';
import { selectProfile } from './slices/authSlice';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import moment from 'moment'
import { getDate, getTodayHabits } from './Api';
import { useDispatch } from 'react-redux';
import { initNotifDb,setNotifIds } from './slices/habitSlice';
import { weekDays } from './Api';

//var notifDB ={habId:{ids:[],date:""}}
var notifDB ={}

const getNotifContent = (habit) => {
  var title = "";
  var content = "";  
  switch(habit.category){
    case "Drink": {
      title=habit.category
      content="It's time to Drink"
      break;
    }
    case "Walk":{
      title=habit.category
      content="It's time to Walk"
      break;
    }
    case "Custom":{
      title=habit.name
      content="Have you achieved your habit?"
      break;
    }    
  }
  var data = [title,content]
  return data
}

async function schedulePushNotification(rise_time,sleep_time,habit) {

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  console.log('I AM HEREEEEEEEE'); 
  var notifData = getNotifContent(habit);
  var notifIds = [];
  let rise = Number((rise_time).split(':')[0])+1; 
  let sleep = Number((sleep_time).split(':')[0])+1;   
  if(sleep<rise){
  sleep=sleep+24;
  }  
  const hoursForNotifications=parseInt((sleep-rise)/habit.reminder);
  var startDate= new Date(Date.now());  
  for (let d=0; d<7; d++){

    if (habit.repeat_days[weekDays[startDate.getDay()]]){        
      startDate.setHours(rise);
      startDate.setMinutes(0);
      startDate.setSeconds(0);       

      for (let i = 0; i < habit.reminder; i++){   
        var trigger = startDate.setHours(rise + 1 +hoursForNotifications*i);     
        
        await Notifications.scheduleNotificationAsync({
          content: {
            title: notifData[0],
            body: notifData[1],
            data: { data: 'goes here' },
          },
          trigger,
        })
        .then((scheduleId)=>{
          notifIds.push(scheduleId); 
                 
        });    
      }
    }
    startDate.setDate(startDate.getDate() + 1);  
  }
  console.log("imposto notifiche")
  store.dispatch(setNotifIds({id:habit.id,not_ids:notifIds}));
}


async function scheduleHabitNotification(habit,rise_time,sleep_time,notifDB)
{
  today = moment(getDate());
  
  if (notifDB == undefined) store.dispatch(initNotifDb());
 
  if (notifDB[habit.id]==undefined){    
    console.log("è und")
    await schedulePushNotification(rise_time,sleep_time,habit);
  }
  else{      
    last_date = moment(notifDB[habit.id].date)     
    if(today.diff(last_date,'days')>=3 ){
      console.log(today.diff(last_date,'days'))
      for (let notId of notifDB[habit.id].ids){
        Notifications.cancelScheduledNotificationAsync(notId)
      }
      await schedulePushNotification(rise_time,sleep_time,habit)   
    }
    console.log("non è und");
  }
}

async function getNotification (){
  Notifications.getAllScheduledNotificationsAsync()
  .then(
    (prom)=> 
    console.log((Object.keys(prom)).length));  
}

async function cancel (){
  Notifications.cancelAllScheduledNotificationsAsync();  
  store.dispatch(initNotifDb())
}



export {schedulePushNotification,scheduleHabitNotification,getNotification,cancel}