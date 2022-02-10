import React from 'react'
import { View, Text } from 'react-native'
import { styles } from '../styles';
import { styleColors } from '../colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import tailwind from 'tailwind-rn';
import { useNavigation } from '@react-navigation/native';
import * as Sharing from "expo-sharing";


const DefaultHeader = ({ title, recap = false, monthly_recap = false, viewShot }) => {
    const navigation = useNavigation();

    const captureAndShareScreenshot = () => {  //share function
        viewShot.current.capture().then((uri) => {
            Sharing.shareAsync("file://" + uri);
        }),
            (error) => console.error("Oops, snapshot failed", error);
    };

    return (
        <View style={styles.header.main}>
            <View style={{ flexDirection: 'row' }}>
                <View style={tailwind("flex-row items-center")}>
                    <View style={styles.header.default}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <MaterialCommunityIcons
                                name="arrow-left"
                                size={30}
                                style={{ color: styleColors.white }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={tailwind("justify-center ")}>
                        <Text style={[tailwind('text-2xl '), { color: styleColors.white }]}>
                            {title}
                        </Text>
                    </View>
                </View>
            </View>
            {recap && (
                <View style={styles.header.recap}>
                    <View>
                        <TouchableOpacity onPress={() => navigation.navigate('Recap')}>
                            <MaterialCommunityIcons
                                name="star-box-multiple-outline"
                                size={30}
                                style={{ color: styleColors.white, marginHorizontal: 5 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity onPress={captureAndShareScreenshot}>
                            <MaterialCommunityIcons
                                name="share"
                                size={35}
                                style={{ color: styleColors.white }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            {monthly_recap && (
                <View style={styles.header.recap}>
                    <View>
                        <TouchableOpacity onPress={captureAndShareScreenshot}>
                            <MaterialCommunityIcons
                                name="share"
                                size={35}
                                style={{ color: styleColors.white }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    )
}

export default DefaultHeader