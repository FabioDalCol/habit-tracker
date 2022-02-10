import React, { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectLoadingInit, selectProfile, setLoadingInit, selectLoading } from './slices/authSlice';
import { onAuthStateChanged } from "@firebase/auth";
import { authbase } from './firebase';
import DrawerScreen from './screens/DrawerScreen';
import DetailScreen from './screens/DetailScreen';
import RecapScreen from './screens/RecapScreen';
import RootProfile from './screens/CreateProfileScreen';



const Stack = createNativeStackNavigator();

const StackNavigator = () => {

    const user = useSelector(selectUser);
    const profile = useSelector(selectProfile);
    const loadingState = useSelector(selectLoading);     //loading between screens
    const loadingInitState = useSelector(selectLoadingInit); //loading on app opening

    const dispatch = useDispatch();

    useEffect(() => {
        onAuthStateChanged(authbase, () => {
            dispatch(setLoadingInit(false));
        });
    }, []);

    if (loadingState || loadingInitState) {  //loading spinner
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', backgroundColor: "white" }}>
                <ActivityIndicator size="large" color="#4263ec" />
            </View>
        )
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user.fullname != null ? (
                profile?.username ? (<>
                    <Stack.Screen name="Root" component={DrawerScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Detail" component={DetailScreen} />
                    <Stack.Screen name="Recap" component={RecapScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="RecreateProfile" component={RootProfile} />
                </>)
                    :
                    (
                        <Stack.Screen name="CreateProfile" component={RootProfile} />
                    )
            ) : (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegistrationScreen} />
                </>
            )}
        </Stack.Navigator>
    )
}

export default StackNavigator


