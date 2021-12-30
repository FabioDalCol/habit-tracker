import React from 'react'
import { View, Text } from 'react-native'
import DefaultHeader from '../components/DefaultHeader'
import { styles } from '../styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button } from 'react-native-elements'
import { logout } from '../hooks/useAuth'
import tailwind from 'tailwind-rn'
import { Image } from 'react-native-elements/dist/image/Image'
import { useSelector } from 'react-redux'
import { selectUser } from '../slices/authSlice'

const ProfileScreen = () => {
    const user = useSelector(selectUser);
    const profilePic = getHigherResProviderPhotoUrl(user.photo_url);
    return (
        <View style={tailwind("flex-1")}>
            <DefaultHeader title="Profile"/>
            <View style={styles.container}>
               <View style={styles.profileCard}> 
                    <Image source={{uri: profilePic}} style={styles.profilePicBig}/>
               </View>
                
                <Button buttonStyle={styles.button} TouchableComponent={TouchableOpacity} onPress = {()=>logout()} title="Logout"/>
            </View>
        </View>
    )
}

export default ProfileScreen
