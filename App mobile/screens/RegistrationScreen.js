import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { Button,Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { register } from '../hooks/useAuth';
import { styles } from '../styles';

const RegistrationScreen = () => {

    const [email,setEmail] = useState('');
    const [fullname,setFullname] = useState('');
    const [password,setPassword] = useState(''); 
    const navigation = useNavigation();
   

    return (
        <View style={styles.container}>
           <StatusBar style="light" />            
            <View style={styles.inputContainer}>
              <Input placeholder="Name" autoFocus type="text" value={fullname} onChangeText={(text)=> setFullname(text)}/>    
              <Input placeholder="Email" autoFocus type="Email" value={email} onChangeText={(text)=> setEmail(text)}/>
              <Input placeholder="Password" secureTextEntry type="Password" value={password} onChangeText={(text)=> setPassword(text)}/>
            </View>
            <Button buttonStyle={styles.button} onPress = {()=>register(email,password,fullname) } title="Register"/>      
        </View>
    )
}
export default RegistrationScreen;



