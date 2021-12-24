import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';


const NotificationHandler = (props ) => {
    
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });


    const {note, setNote} = props.state;
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
      registerForPushNotificationsAsync().then(token => setNote({...note, expoPushToken:token}));

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNote({...note, notification:notification});
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });

      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <Text>Your expo push token: {note.expoPushToken}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Title: {note.notification && note.notification.request.content.title} </Text>
          <Text>Body: {note.notification && note.notification.request.content.body}</Text>
          <Text>Data: {note.notification && JSON.stringify(note.notification.request.content.data)}</Text>
        </View>
        <Button
          title="Press to schedule a notification"
          onPress={async () => {
            await schedulePushNotification(3);
          }}
        />
      </View>
    );
  

  async function schedulePushNotification(times) {

    console.log('I AM HEREEEEEEEE');

    let rise = Number(('08:30').split(':')[0]); //da sostituire con note.rise
    let sleep = Number(('01:30').split(':')[0]); //da sostituire con note.sleep
    if(sleep<rise){
    sleep=sleep+24;
    }

    const hoursForNotifications=4; //parseInt((sleep-rise)/times);
    var startDate= new Date(Date.now());
    startDate.setHours(rise);
    startDate.setMinutes(0);
    startDate.setSeconds(0);


    for (let i = 1; i < times+1; i++)
    {
      var trigger = new Date(Date.now() + i * hoursForNotifications * 1000);
      //var trigger = startDate.setHours(startDate.getHours()+hoursForNotifications*i); versione finale
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Drink ",
          body: 'It\' time to drink!',
          data: { data: 'goes here' },
        },
        trigger,
      });
    }
  }

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }
}

export default NotificationHandler