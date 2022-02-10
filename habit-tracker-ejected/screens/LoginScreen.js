import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native'
import { Button, Input, Image, SocialIcon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native'
import { signInWithGoogle, signin } from '../support/useAuth';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>

            <StatusBar style="dark" />
            <Text style={{ fontSize: 28, fontWeight: "700", marginTop: -40, paddingBottom: 15 }}>Habit tracker</Text>
            <Image source={require("../images/habit.png")}
                style={{ width: 200, height: 200 }}
            />
            <View style={styles.inputContainer}>
                <Input placeholder="Email" type="Email" value={email} onChangeText={(text) => setEmail(text)} />
                <Input placeholder="Password" secureTextEntry type="Password" onSubmitEditing={() => signin(email, password)} value={password} onChangeText={(text) => setPassword(text)} />
            </View>
            <Button buttonStyle={styles.button} TouchableComponent={TouchableOpacity} onPress={() => signin(email, password)} title="Login" />
            <Button buttonStyle={styles.button} TouchableComponent={TouchableOpacity} onPress={() => navigation.navigate('Register')} title="Register" />
            <SocialIcon style={styles.buttonGoogle} title='Sign In With Google' button type='google' onPress={signInWithGoogle} />

        </SafeAreaView>
    )
}

export default LoginScreen


