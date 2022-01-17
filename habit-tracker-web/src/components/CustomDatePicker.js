import * as React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import PickersDay from '@mui/lab/PickersDay';
import moment from 'moment'
import '../App.css'


//Set the custom picker day styles based on progress for day
const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== 'Red' && prop !== 'isFirstDay' && prop !== 'isLastDay',
})(({ theme, Red, isFirstDay, isLastDay }) => ({
  ...(Red && {
    borderRadius: 90,
    backgroundColor: "#dc3545",
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderRadius: 90,
    backgroundColor: '#ffc107',
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isLastDay && {
    borderRadius: 90,
    backgroundColor: '#198754',
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
}));

export default function CustomDay({red, yellow, green, first, setDateHome}) {
  const [dateCustom, setDateCustom] = React.useState(new Date());

  //return a custom picker based on habit progress % for each date
  const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
    if (!dateCustom) {
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
        label="Picked date"
        value={dateCustom}
        onChange={(newValue) => {
          setDateCustom(newValue);
          setDateHome(newValue);
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