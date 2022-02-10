import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './StackNavigator';
import { Provider } from "react-redux"
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store, { persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}


