import React from 'react'
import { View, Text } from 'react-native'
import DefaultHeader from '../components/DefaultHeader'
import { styles } from '../styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button, Input } from 'react-native-elements'
import { logout } from '../hooks/useAuth'
import tailwind from 'tailwind-rn'
import { Image } from 'react-native-elements/dist/image/Image'
import { useSelector } from 'react-redux'
import { selectUser,selectProfile } from '../slices/authSlice'

const ProfileScreen = () => {
    const user = useSelector(selectUser);
    const profile = useSelector(selectProfile);
    const profilePic = getHigherResProviderPhotoUrl(user.photo_url);
    return (
        <View style={tailwind("flex-1")}>
            <DefaultHeader title="Profile"/>
            <View style={styles.profilePage.container}>
               <View style={styles.profilePage.profileCard}>
                {profilePic != undefined ? (
                    <Image source={{uri: profilePic}} style={styles.profilePicBig}/>)
                    :
                    (<Image source={require("../images/avatar.jpg")} style={styles.profilePicBig}/>)}
                <Text style={{fontSize:28,fontWeight:"600", paddingTop:10, color:"white"}} >{profile.name}</Text>
                <Text style={{fontSize:20,fontWeight:"700", paddingTop:5, color:"white"}} >«Tracking habits since 2021»</Text> 
               </View>
               <Input value={"Fabio"} label={"Name"}  inputContainerStyle={styles.inputTextBox.container}  style={styles.inputTextBox.box} placeholder="Name"/>
                <Button buttonStyle={styles.button} TouchableComponent={TouchableOpacity} onPress = {()=>logout()} title="Logout"/>
            </View>
        </View>
    )
}

export default ProfileScreen
