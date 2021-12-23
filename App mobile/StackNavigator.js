//React
import React, { useLayoutEffect, useEffect } from 'react'
import { View} from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Navigation
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';




//Redux & auth
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectLoadingInit, setUser, setLoadingInit, selectLoading } from './slices/authSlice';
import { onAuthStateChanged} from "@firebase/auth";
import { auth} from './firebase';
import darkColors from 'react-native-elements/dist/config/colorsDark';
import DrawerScreen from './screens/DrawerScreen';



const Stack = createNativeStackNavigator();

const StackNavigator = () => {  

    const user = useSelector(selectUser);    
    const loadingState = useSelector(selectLoading);     //loading between screens
    const loadingInitState = useSelector(selectLoadingInit); //loading on app opening
   
    const dispatch = useDispatch();

    useEffect(() => {        
        onAuthStateChanged(auth, (user)=> {
            if (user){                      
                 
            }
            else{
                dispatch(setUser(null));
            }
            dispatch(setLoadingInit(false));
        });        
    },[]);   
    
    if (loadingState || loadingInitState){
        return(
            <View style={{ flex: 1}} ></View>   //TODO loading screen
        )
    }
    
    return (
        <Stack.Navigator screenOptions={{headerShown:false }}>
            {user ? (
                <>
                <Stack.Screen name="Root" component={DrawerScreen} options={{ headerShown: false }}/>                
                </>
            ) : ( 
                <>              
                <Stack.Screen name="Login" component={LoginScreen}/>
                <Stack.Screen name="Register" component={RegistrationScreen}/>
                </>
            )}
        </Stack.Navigator>
    )
}

export default StackNavigator


