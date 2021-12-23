import React from 'react'
import { View, Text } from 'react-native'
import DefaultHeader from '../components/DefaultHeader'

const HabitListScreen = () => {
    return (
        <View>
            <DefaultHeader title="Manage Habits"/>
            <Text>Habit List</Text>
        </View>
    )
}

export default HabitListScreen
