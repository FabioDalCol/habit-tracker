import React from 'react'
import { View, Text } from 'react-native'
import { styles } from '../styles';
import { styleColors } from '../colors';
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';
import getHabits, {getDate} from '../Api'


const DetailCalendar = ({habit}) =>{  
    
    //marker for detail
    const markThem= () =>
    {
        var markerDates={};
        for (var k of Object.keys(habit.stats)){
            if(habit.stats[k].completed)
                markerDates[k]={selected: true, selectedColor: 'green'};
            else
                markerDates[k]={selected: true, selectedColor: 'red'};
        }
        return markerDates;
    }

    return (
        <View>
            <Calendar
                // Initially visible month. Default = now
                current={getDate()}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                minDate={habit.created}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                maxDate={getDate()}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day) => {console.log('selected day', day)}}
                // Handler which gets executed on day long press. Default = undefined
                onDayLongPress={(day) => {console.log('selected day', day)}}
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                onMonthChange={(month) => {console.log('month changed', month)}}
                // Do not show days of other months in month page. Default = false
                hideExtraDays={true}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
                firstDay={1}
                // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                onPressArrowLeft={subtractMonth => subtractMonth()}
                // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                onPressArrowRight={addMonth => addMonth()}
                // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                disableAllTouchEventsForDisabledDays={true}
                // Enable the option to swipe between months. Default = false
                enableSwipeMonths={true}
                //
                markedDates={markThem()}
                //
                />          
        </View>
    )
}

export default DetailCalendar