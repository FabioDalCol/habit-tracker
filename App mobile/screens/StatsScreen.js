import React from 'react'
import { View, Text } from 'react-native'
import DefaultHeader from '../components/DefaultHeader'
import Calendario from '../components/Calendario'

const StatsScreen = () => {
    return (<>
        <View>
            <DefaultHeader title="Stats"/>
        </View>
        <View>
            <Calendario/>
        </View>
        </>
    )
}

export default StatsScreen
