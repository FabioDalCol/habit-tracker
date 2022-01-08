import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Pedometer} from 'expo-legacy';
import { useState } from 'react';
import { useEffect } from 'react';

export const TestScreen = () => {
  state = {
    isPedometerAvailable: 'checking',
    pastStepCount: 0,
    currentStepCount: 0,
  };

  const [isPedometerAvailable,setisPedometerAvailable] = useState('checking');
  const [pastStepCount,setpastStepCount] = useState(0);
  const [currentStepCount,setcurrentStepCount] = useState(0);

  useEffect(() => {
     _subscribe()
      
  }, [])

 const _subscribe = () => {
     const _subscription = Pedometer.watchStepCount(result => {     
      setcurrentStepCount(result.step)
    });

    Pedometer.isAvailableAsync().then(
      result => {        
        setisPedometerAvailable(String(result))
      },
      error => {        
        setisPedometerAvailable( 'Could not get isPedometerAvailable: ' + error)
      }
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      result => {       
        setpastStepCount(result.steps)
      },
      error => {       
        setpastStepCount('Could not get stepCount: ' + error)
      }
    );
  };

 const _unsubscribe = () => {
    _subscription && _subscription.remove();
    _subscription = null;
  };
 
    return (
      <View >
        <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
        <Text>Steps taken in the last 24 hours: {pastStepCount}</Text>
        <Text>Walk! And watch this go up: {currentStepCount}</Text>
      </View>
    );
  
}