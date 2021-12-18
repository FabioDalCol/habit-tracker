import React from 'react'
import { View, Text } from 'react-native'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { Image } from 'react-native-elements'
import { styles } from '../styles'
import { styleColors } from '../colors'

const CustomDrawer = (props) => {
    return (
        <View style={{flex:1}} >   
        <DrawerContentScrollView style={{backgroundColor:styleColors.themeColor}}>
            <View style={styles.drawer.header}>
                <Image source={require("../images/pug.png")} style={styles.profilePic}/>
            </View>
            <View style = {styles.drawer.sepLine} />
            <View style={styles.drawer.content }>
                <DrawerItemList  {...props}/>
            </View>
        </DrawerContentScrollView>      

        </View>
    )
}

export default CustomDrawer
