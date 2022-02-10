import React from 'react'
import { View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import DefaultHeader from '../components/DefaultHeader'
import { styles } from '../styles'
import { styleColors } from '../colors'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Button } from 'react-native-elements'
import { Image } from 'react-native-elements/dist/image/Image'
import { logout } from '../support/useAuth'
import tailwind from 'tailwind-rn'
import { useSelector } from 'react-redux'
import { selectUser, selectProfile } from '../slices/authSlice'
import { selectHabits } from '../slices/habitSlice'
import { getFirstDate } from '../components/StatsCalendar'

const ProfileScreen = () => {
    const user = useSelector(selectUser);
    const profile = useSelector(selectProfile);
    const habits = useSelector(selectHabits);
    const profilePic = getHigherResProviderPhotoUrl(user.photo_url);
    const navigation = useNavigation();

    const year = () => {           //returns first created habit year or current year
        if (habits?.length > 0) {
            return getFirstDate(habits).split("-")[0]
        }
        else {
            return new Date().getFullYear()
        }
    }
    return (
        <View style={tailwind("flex-1")}>
            <DefaultHeader title="Profile" />
            <View style={styles.profilePage.container}>
                <View style={styles.profilePage.profileCard}>
                    {profilePic != undefined ?
                        (<Image source={{ uri: profilePic }} style={styles.profilePicBig} />)
                        :
                        (<Image source={require("../images/avatar.jpg")} style={styles.profilePicBig} />)
                    }
                    <Text style={styles.profilePage.user} >{profile.username}</Text>
                    <Text style={styles.profilePage.tracking} >«Tracking habits since {year()}»</Text>
                </View>
                <View>
                    <TouchableOpacity>
                        <MaterialCommunityIcons
                            name="pencil"
                            size={35}
                            style={{ color: styleColors.pbRed, marginLeft: "80%" }}
                            onPress={() => { navigation.navigate('RecreateProfile') }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View>
                        <Text style={styles.profilePage.label}>Age </Text>
                        <Text style={styles.profilePage.label}>Height </Text>
                        <Text style={styles.profilePage.label}>Rise time </Text>
                        <Text style={styles.profilePage.label}>Sleep time </Text>
                    </View>
                    <View>
                        <Text style={styles.profilePage.valueBox}>{profile.age}</Text>
                        <View style={styles.profilePage.line}>
                            <Text style={styles.profilePage.valueBox}>{profile.height}</Text>
                            <Text style={styles.profilePage.label}> cm</Text>
                        </View>
                        <Text style={styles.profilePage.valueBox}>{profile.rise_time}</Text>
                        <Text style={styles.profilePage.valueBox}>{profile.sleep_time}</Text>
                    </View>
                </View>
                <Button style={{ marginTop: "30%" }} buttonStyle={styles.profilePage.button} TouchableComponent={TouchableOpacity} onPress={() => logout()} title="Sign Out" />
            </View>
        </View>
    )
}

export default ProfileScreen
