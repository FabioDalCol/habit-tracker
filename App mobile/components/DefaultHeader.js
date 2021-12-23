import React from 'react'
import { View, Text } from 'react-native'
import { styles } from '../styles';
import { styleColors } from '../colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import tailwind from 'tailwind-rn';
import { logout } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

const DefaultHeader = ({title}) => {
    const navigation = useNavigation();
    
    return (
        <View style={{ backgroundColor: styleColors.themeColor }}>
            <View style={tailwind("flex-row items-center")}>
                <View style={styles.header.default}>
                    <TouchableOpacity onPress={()=> navigation.goBack() }>
                        <MaterialCommunityIcons
                            name="arrow-left"
                            size={30}
                            style={{ color: styleColors.white }}
                        />
                    </TouchableOpacity>
                </View> 
                <View style={tailwind("justify-center ")}>
                    <Text style={[tailwind('text-2xl '),{ color: styleColors.white}]}>
                            {title}
                    </Text>                    
                </View> 
            </View>  
            
        </View>
    )
}

export default DefaultHeader