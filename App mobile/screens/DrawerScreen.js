import React from 'react'
import { View, Text } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';
import CustomDrawer from './CustomDrawer';

const DrawerScreen = () => {
    const Drawer = createDrawerNavigator();

    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props}/>} screenOptions={{headerShown:false }}>           
          <Drawer.Screen name="Home" component={HomeScreen}  />
          <Drawer.Screen name="Settings" component={SettingsScreen}  />      
        </Drawer.Navigator>
      );
}

export default DrawerScreen
//<View style = {{height: 1, backgroundColor: 'gray'}} /> 