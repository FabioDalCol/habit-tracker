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
import { TextInput } from 'react-native-gesture-handler'


const ProfileScreen = () => {
    const user = useSelector(selectUser);
    const profile = useSelector(selectProfile);
    const profilePic = getHigherResProviderPhotoUrl(user.photo_url);
    return (
        <View style={tailwind("flex-1")}>
            <DefaultHeader title="Profile"/>
            <View style={styles.profilePage.container}>
                <View style={styles.profilePage.profileCard}>
                    {profilePic != undefined ? 
                        (<Image source={{uri: profilePic}} style={styles.profilePicBig}/>)
                        :
                        (<Image source={require("../images/avatar.jpg")} style={styles.profilePicBig}/>)
                    }
                    <Text style={{fontSize:28,fontWeight:"600", paddingTop:10, color:"white"}} >{profile.username}</Text>
                    <Text style={{fontSize:20,fontWeight:"700", paddingTop:5, color:"white"}} >«Tracking habits since 2021»</Text> 
                </View>
                <View style={{flexDirection:"row", paddingRight:50}}>
                    <View style={{borderWidth:0}} >
                        <Text style={styles.profilePage.label}>Age </Text>
                        <Text style={styles.profilePage.label}>Height </Text>
                        <Text style={styles.profilePage.label}>Rise time </Text>
                        <Text style={styles.profilePage.label}>Sleep time </Text>
                    </View>
                    <View style={{borderWidth:0, paddingLeft:0}}>                    
                        <Text style={styles.profilePage.valueBox}>22</Text>    
                        <View style={styles.profilePage.line}>                    
                            <Text style={styles.profilePage.valueBox}>173</Text>
                            <Text style={styles.profilePage.label}> cm</Text>                                   
                        </View>  
                        <Text style={styles.profilePage.valueBox}>07:22</Text>
                        <Text style={styles.profilePage.valueBox}>17:22</Text>   
                    </View>
                </View>                
               
                <Button buttonStyle={[styles.button,{marginTop:120}]} TouchableComponent={TouchableOpacity} onPress = {()=>logout()} title="Logout"/>
            </View>
        </View>
    )
}

export default ProfileScreen
