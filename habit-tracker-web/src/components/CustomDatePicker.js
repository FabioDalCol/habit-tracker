import * as React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import PickersDay from '@mui/lab/PickersDay';
import endOfWeek from 'date-fns/endOfWeek';
import isSameDay from 'date-fns/isSameDay';
import isWithinInterval from 'date-fns/isWithinInterval';
import startOfWeek from 'date-fns/startOfWeek';
import moment from 'moment'
import '../App.css'

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== 'Red' && prop !== 'isFirstDay' && prop !== 'isLastDay',
})(({ theme, Red, isFirstDay, isLastDay }) => ({
  ...(Red && {
    borderRadius: 90,
    backgroundColor: 'red',
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderRadius: 90,
    backgroundColor: '#ff7d00',
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isLastDay && {
    borderRadius: 90,
    backgroundColor: 'green',
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
}));

export default function CustomDay({red, yellow, green, first}) {
  const [value, setValue] = React.useState(new Date());
  const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
    if (!value) {
      return <PickersDay {...pickersDayProps} />;
    }
    const redDate = (date) => {return red.includes(moment(date).format('YYYY-MM-DD'))}
    const Red= redDate(date)
    
    const yellowDate = (date) => {return yellow.includes(moment(date).format('YYYY-MM-DD'))}
    const isFirstDay = yellowDate(date)
    
    const greenDate = (date) => {return green.includes(moment(date).format('YYYY-MM-DD'))}
    const isLastDay = greenDate(date)

    return (
      <CustomPickersDay
        {...pickersDayProps}
        Red={Red}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
      />
    );
  };

  return (     
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDatePicker
        className='static-picker'
        displayStaticWrapperAs="desktop"
        label="Week picker"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        minDate={new Date(first)} 
        maxDate={new Date()}
        renderDay={renderWeekPickerDay}
        renderInput={(params) => <TextField {...params} />}
        inputFormat="'Week of' MMM d"
        disableHighlightToday={true}
      />
    </LocalizationProvider>
  );
}