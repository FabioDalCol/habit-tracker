import React, { useRef } from 'react'
import { View, Text } from 'react-native'
import DefaultHeader from '../components/DefaultHeader'
import { useSelector } from 'react-redux';
import { selectHabits } from '../slices/habitSlice';
import { styles } from '../styles';
import { styleColors } from '../colors';
import { getDate } from '../support/Api'
import { Image } from 'react-native-elements';
import { selectProfile } from "../slices/authSlice";
import moment from 'moment'
import tailwind from 'tailwind-rn';
import ViewShot from "react-native-view-shot";

export const getMonthlyRecap = (habits) => {
    const month = moment(getDate()).month()
    var total = {}
    for (var habit of habits) {
        if (habit.stats)
            for (var date of Object.keys(habit.stats)) {
                if (moment(date).month() == month) {
                    if (habit.countable) {
                        if (total[habit.category] == undefined) total[habit.category] = 0;
                        total[habit.category] = total[habit.category] + parseInt(habit.stats[date].value);
                    }
                    else {
                        if (total[habit.category] == undefined) total[habit.category] = {}
                        if (total[habit.category][habit.name] == undefined) total[habit.category][habit.name] = 0
                        if (habit.stats[date].completed) total[habit.category][habit.name]++;
                    }
                }
            }
    }
    return total
}

const randomColor = styleColors.custom[Math.floor(Math.random() * styleColors.custom.length)]; //pick random color for custom habits

const RecapScreen = () => {

    const viewShot = useRef();
    const habits = useSelector(selectHabits);
    const profile = useSelector(selectProfile);
    const total = getMonthlyRecap(habits)

    return (<>
        <ViewShot ref={viewShot} style={{ flex: 1, backgroundColor: styleColors.background }} options={{ format: "png", quality: 1 }}>
            <View>
                <DefaultHeader title="Monthly Recap" monthly_recap={true} viewShot={viewShot} />
            </View>
            <View style={{ flex: 1 }}>
                <View style={tailwind("flex-row pt-8 pl-2")}>
                    <Image source={require("../images/baby-yoda.png")}
                        style={{ width: 48, height: 48 }}
                    />
                    <View style={tailwind("flex-row  self-center")}>
                        <Text style={[tailwind("text-4xl font-semibold pl-2 "), { color: styleColors.themeColor }]} >Good job, </Text>
                        <Text style={[tailwind("text-4xl font-bold "), { color: styleColors.themeColor }]} >{profile.username}</Text>
                        <Text style={[tailwind("text-4xl font-semibold "), { color: styleColors.themeColor }]} >! </Text>
                    </View>
                </View>

                <View style={[tailwind("flex-1"), styles.recapScreen.content]}>
                    <View >
                        <Text style={[tailwind("font-semibold pt-8 pb-6 "), styles.recapScreen.mainCap]} >{(total.Walk + total.Drink) > 0 ? " This month..." : "This month you completed..."}</Text>
                    </View>
                    {total.Walk > 0 && (
                        <>
                            <View style={tailwind("flex-row  ")}>
                                <Image source={require("../images/man-running.png")}
                                    style={{ width: 50, height: 50 }}
                                />
                                <View style={[tailwind("flex-row flex-wrap flex-1 self-center "), styles.recapScreen.walk]}>
                                    <Text style={styles.recapScreen.text} >You've done </Text>
                                    <Text style={styles.recapScreen.textWeight} >{total.Walk}</Text>
                                    <Text style={styles.recapScreen.text} > steps</Text>
                                    <Text style={styles.recapScreen.text} > that's almost </Text>
                                    <Text style={styles.recapScreen.textWeight} >{Math.round(total.Walk * 0.00415 * profile.height / 100) / 10}</Text>
                                    <Text style={styles.recapScreen.text} > km !</Text>
                                </View>
                            </View>
                        </>
                    )}
                    {total.Drink > 0 && (
                        <View style={[tailwind("flex-row  pt-6 "), { marginLeft: -4 }]}>
                            <Image source={require("../images/cup.png")}
                                style={{ width: 50, height: 50 }}
                            />
                            <View style={[tailwind("flex-row flex-wrap flex-1 self-center "), styles.recapScreen.drink]}>
                                <Text style={styles.recapScreen.text} >You drank </Text>
                                <Text style={styles.recapScreen.textWeightWater} >{total.Drink}</Text>
                                <Text style={styles.recapScreen.text} > glasses </Text>
                                <Text style={styles.recapScreen.text} >of water</Text>
                            </View>
                        </View>
                    )}
                    {(total.Walk + total.Drink) > 0 && (
                        <View>
                            <Text style={[tailwind("font-semibold pt-8 "), styles.recapScreen.subCap]} >You also completed... </Text>
                        </View>
                    )}
                    <View >
                        {total.Custom != undefined && (Object.keys(total.Custom).map(key =>
                            <View key={key} style={[tailwind("flex-row  pt-4 pl-2")]}>
                                <Image source={require("../images/target.png")}
                                    style={{ width: 35, height: 35 }}
                                />
                                <View style={[tailwind("flex-row  self-center"), styles.recapScreen.completed]}>
                                    <Text style={[styles.recapScreen.textWeight, { color: randomColor }]} > {total.Custom[key]} </Text>
                                    <Text style={styles.recapScreen.text} >{total.Custom[key] > 1 ? "times" : "time"}</Text>
                                    <Text style={[styles.recapScreen.textWeight, { color: randomColor }]}> {key}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ViewShot>
    </>)
}

export default RecapScreen
