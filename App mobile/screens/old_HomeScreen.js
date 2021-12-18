import React  from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { selectUser } from '../slices/authSlice'
import { logout } from '../hooks/useAuth'
import tailwind from 'tailwind-rn'
import { setUser } from '../slices/authSlice'
import { useDispatch } from 'react-redux'

const HomeScreen = () => {
    
    const user = useSelector(selectUser);
    const navigation = useNavigation();
    console.log(user);
    const dispatch = useDispatch();

     
    return (
        <View style={tailwind('flex-1 content-center justify-center')}>
            <Text style={tailwind('text-3xl text-blue-800 font-semibold')}>Hello {user.fullname?.split(/(\s+)/)[0]}  </Text>
            <Button title="Go to fake screen" onPress={() => navigation.navigate("Tasks") } />
            <Button title="logout" onPress={()=>{ logout()}} />              
        </View>
    )
}

export default HomeScreen;
