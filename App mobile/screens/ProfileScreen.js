import React from 'react'
import { View, Text } from 'react-native'
import DefaultHeader from '../components/DefaultHeader'
import { styles } from '../styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button } from 'react-native-elements'
import { logout } from '../hooks/useAuth'
import tailwind from 'tailwind-rn'

const ProfileScreen = () => {
    return (
        <View style={tailwind("flex-1")}>
            <DefaultHeader title="Profile"/>
            <View style={styles.container}>
                
                <Button buttonStyle={styles.button} TouchableComponent={TouchableOpacity} onPress = {()=>logout()} title="Logout"/>
            </View>
        </View>
    )
}

export default ProfileScreen
