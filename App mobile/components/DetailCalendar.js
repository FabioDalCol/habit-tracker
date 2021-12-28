import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { styles } from '../styles';
import { styleColors } from '../colors';
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';
import getHabits, {getDate} from '../Api'



const DetailCalendar = ({habit, datepicked, setDate}) =>{  
    
    const [selectedDate, setSelectedDate] = useState(getDate())

    //marker for detail
    const markDay= () =>
    {
        var markerDates={};
        for (var k of Object.keys(habit.stats)){
            if(habit.stats[k].completed)
                markerDates[k]={ marked: true, dotColor: 'green',  };
            else
                markerDates[k]={ marked: true, dotColor: 'red',  };
            if(k==selectedDate){
                    markerDates[k].selected = true
                    markerDates[k].customStyles = {
                        container: {
                          backgroundColor: 'white',
                          elevation: 2
                        },
                        text: {
                          color: 'black'
                        }
                      }
            }
        }
        if(selectedDate!=getDate())
        markerDates[getDate()]={customStyles:{text: {color: 'black'}}};

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
                onDayPress={(day) => {setDate(day.dateString);setSelectedDate(day.dateString)}}
                // Handler which gets executed on day long press. Default = undefined
                //onDayLongPress={(day) => {console.log('selected day', day)}}
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
                markingType={'custom'}
                //
                markedDates={markDay()}
                //
                />          
        </View>
    )
}

export default DetailCalendar