import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, Input } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { register } from '../support/useAuth';
import { styles } from '../styles';

const RegistrationScreen = () => {

    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [password, setPassword] = useState('');

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.inputContainer}>
                <Input placeholder="Name" autoFocus type="text" value={fullname} onChangeText={(text) => setFullname(text)} />
                <Input placeholder="Email" type="Email" value={email} onChangeText={(text) => setEmail(text)} />
                <Input placeholder="Password" secureTextEntry type="Password" value={password} onChangeText={(text) => setPassword(text)} />
            </View>
            <Button buttonStyle={styles.button} onPress={() => register(email, password, fullname)} title="Register" />
        </View>
    )
}
export default RegistrationScreen;



