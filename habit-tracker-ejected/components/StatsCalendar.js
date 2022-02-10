import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { styleColors } from '../colors';
import { Calendar } from 'react-native-calendars';
import { getDate } from '../support/Api'
import moment from 'moment'

export const getFirstDate = (habits) => { //get first habit creation date
    var dates = [];
    for (var habit of habits) {
        dates.push(habit.created)
    }
    return dates.sort()[0]
}

const StatsCalendar = ({ habits, datepicked, setDate }) => {

    const [selectedDate, setSelectedDate] = useState(getDate())

    const countCompleteFromDate = (date) => {
        var completed = 0;
        var total = 0;
        if (habits == null) return undefined;
        for (var habit of habits) {
            if (habit.stats) {
                if (habit.stats[date]) {        //If today weekday is true
                    total = total + 1;
                    completed = completed + habit.stats[date].completed;
                }
            }
        }
        return (total ? completed / total : undefined);
    }

    const getDaysBetweenDates = (startDate, endDate) => {
        var now = startDate.clone(), dates = [];
        while (now.isSameOrBefore(endDate)) {
            dates.push(now.format('YYYY-MM-DD'));
            now.add(1, 'days');
        }
        return dates
    };


    const markDay = () => {              //marker for general calendar
        let dates = getDaysBetweenDates(moment(getFirstDate(habits)), new Date());
        var markerDates = {};
        for (var k of dates) {
            let progress = countCompleteFromDate(k);
            if (progress == undefined) continue;
            if (progress < 0.5)
                markerDates[k] = { marked: true, dotColor: styleColors.pbRed, customStyles: { text: { color: 'black' } } };
            else {
                if (progress < 1)
                    markerDates[k] = { marked: true, dotColor: styleColors.pbOrange, customStyles: { text: { color: 'black' } } };
                else
                    markerDates[k] = { marked: true, dotColor: styleColors.greenComp, customStyles: { text: { color: 'black' } } };
            }
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
                maxDate={getDate()}
                onDayPress={(day) => { setDate(day.dateString); setSelectedDate(day.dateString) }}
                onMonthChange={(month) => { console.log('month changed', month) }}
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

export default StatsCalendar