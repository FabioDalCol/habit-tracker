import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import {Provider} from "react-redux"
import { LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store, {persistor} from './store';
import {PersistGate} from 'redux-persist/integration/react';


LogBox.ignoreAllLogs();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
      <SafeAreaProvider>
      <NavigationContainer>         
          <StackNavigator/>       
      </NavigationContainer>
      </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

 
