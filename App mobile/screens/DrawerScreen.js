import React from 'react'
import { View, Text } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import CustomDrawer from './CustomDrawer';
import HabitListScreen from './HabitListScreen';
import StatsScreen from './StatsScreen';

const DrawerScreen = () => {
    const Drawer = createDrawerNavigator();

    return (
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props}/>} screenOptions={{headerShown:false }}>           
          <Drawer.Screen name="Home" component={HomeScreen}   />
          <Drawer.Screen name="Habit list" component={HabitListScreen}  />
          <Drawer.Screen name="Stats" component={StatsScreen} />
          <Drawer.Screen name="Profile" component={ProfileScreen}  />
        </Drawer.Navigator>
      );
}

export default DrawerScreen
//<View style = {{height: 1, backgroundColor: 'gray'}} /> 