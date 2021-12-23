import React from 'react'
import { View, Text } from 'react-native'
import { styles } from '../styles';
import { styleColors } from '../colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import tailwind from 'tailwind-rn';
import { logout } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

const HomeHeader = () => {
    const navigation = useNavigation();
    
    return (
        <View style={{ backgroundColor: styleColors.themeColor }}>
            <View style={styles.header.home}>
          <TouchableOpacity onPress={()=> navigation.openDrawer() }>
          <MaterialCommunityIcons
            name="text"
            size={30}
            style={{ color: styleColors.white }}
          />
          </TouchableOpacity>
          <View style={tailwind('flex-row')}>
          <TouchableOpacity onPress={()=> navigation.navigate('Stats')} >
            <MaterialCommunityIcons
              name="calendar-outline" //
              size={30}
              style={{ color: styleColors.white }}
            />
            </TouchableOpacity>            
          </View>
        </View>  
        </View>
    )
}

export default HomeHeader
