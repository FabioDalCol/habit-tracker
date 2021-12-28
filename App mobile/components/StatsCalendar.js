import React from 'react'
import { View, Text } from 'react-native'
import { styles } from '../styles';
import { styleColors } from '../colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import tailwind from 'tailwind-rn';
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';
import {getDate} from '../Api'
import moment from 'moment'
import { useState } from 'react';


const StatsCalendar = ({habits, datepicked, setDate}) =>{  

    const [selectedDate, setSelectedDate] = useState(getDate())

    const countCompleteFromDate = (date) =>
    {
        var completed=0;   
        var total=0;
        if(habits == null ) return 0;
        for(var habit of habits){             
            if(habit.stats)
            {          
                if (habit.stats[date]){        //If today weekday is true
                    total=total+1;
                    completed=completed+habit.stats[date].completed;                
                } 
            }     
        }  
        return (total?completed/total:0);
    }

    const getDaysBetweenDates = (startDate, endDate) => {
        var now = startDate.clone(), dates = [];
        while (now.isSameOrBefore(endDate)) {
            dates.push(now.format('YYYY-MM-DD'));
            now.add(1, 'days');
        }
        return dates
    };

    //marker for general
    const markDay = () =>
    {
        let dates=getDaysBetweenDates(moment('2021-12-01'), new Date());
        var markerDates={};
        for (var k of dates){
            let progress=countCompleteFromDate(k);
            if(progress<0.5)
                markerDates[k]={ marked: true, dotColor: 'red',  };
            else
            { 
                if(progress<1)
                    markerDates[k]={ marked: true, dotColor: 'orange'};
                else
                    markerDates[k]={ marked: true, dotColor: 'green'};
            }
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
        return markerDates;
    }
    
    return (
        
        <View>
            <Calendar
                // Initially visible month. Default = now
                current={getDate()}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                //minDate={'2012-05-10'}
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

export default StatsCalendar