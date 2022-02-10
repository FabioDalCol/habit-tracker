import React, { useState } from 'react'
import { View } from 'react-native'
import { styleColors } from '../colors';
import { Calendar } from 'react-native-calendars';
import { getDate } from '../support/Api'

const DetailCalendar = ({ habit, datepicked, setDate, setMonth }) => {

    const [selectedDate, setSelectedDate] = useState(getDate())

    //marker for detail
    const markDay = () => {
        var markerDates = {};
        for (var k of Object.keys(habit.stats)) {
            if (habit.stats[k].completed)
                markerDates[k] = { marked: true, dotColor: styleColors.greenComp, customStyles: { text: { color: 'black' } } };
            else
                markerDates[k] = { marked: true, dotColor: styleColors.pbRed, customStyles: { text: { color: 'black' } } };
            if (k == selectedDate) {
                markerDates[k].selected = true
                markerDates[k].customStyles = {
                    container: {
                        backgroundColor: styleColors.greyish,
                        elevation: 2
                    },
                    text: {
                        color: 'white'
                    }
                }
            }
        }
        if (markerDates[getDate()]) {
            if (markerDates[getDate()].selected)
                markerDates[getDate()].customStyles.text.color = 'white';
            else
                markerDates[getDate()].customStyles.text.color = 'black';
        }

        return markerDates;
    }

    return (
        <View>
            <Calendar
                current={getDate()}
                minDate={habit.created}
                maxDate={getDate()}
                onDayPress={(day) => { setDate(day.dateString); setSelectedDate(day.dateString) }}
                onMonthChange={(month) => { setMonth(month.month - 1) }}
                hideExtraDays={true}
                firstDay={1}
                onPressArrowLeft={subtractMonth => subtractMonth()}
                onPressArrowRight={addMonth => addMonth()}
                disableAllTouchEventsForDisabledDays={true}
                enableSwipeMonths={true}
                markingType={'custom'}
                markedDates={markDay()}
            />
        </View>
    )
}

export default DetailCalendar