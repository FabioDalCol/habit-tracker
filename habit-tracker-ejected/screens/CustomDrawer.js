import React from 'react'
import { View } from 'react-native'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { Image } from 'react-native-elements'
import { styles } from '../styles'
import { styleColors } from '../colors'
import { useSelector } from 'react-redux'
import { selectUser } from '../slices/authSlice'

getHigherResProviderPhotoUrl = (photoURL) => {    //take GoogleProfile photo_url and computes high resolution photo url
    let result = photoURL;
    if (result != undefined) {
        result = photoURL.replace('s96-c', 's400-c');
    }
    return result;
};

const CustomDrawer = (props) => {        //custom header of drawer navigator
    const user = useSelector(selectUser);
    const profilePic = getHigherResProviderPhotoUrl(user.photo_url);

    return (
        <View style={{ flex: 1 }} >
            <DrawerContentScrollView style={{ backgroundColor: styleColors.themeColor }}>
                <View style={styles.drawer.header}>
                    {profilePic != undefined ? (
                        <Image source={{ uri: profilePic }} style={styles.profilePic} />)
                        :
                        (<Image source={require("../images/avatar.jpg")} style={styles.profilePic} />)}
                </View>
                <View style={styles.drawer.sepLine} />
                <View style={styles.drawer.content}>
                    <DrawerItemList  {...props} />
                </View>
            </DrawerContentScrollView>

        </View>
    )
}

export default CustomDrawer
