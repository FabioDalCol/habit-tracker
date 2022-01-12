import React from 'react';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useSelector } from "react-redux";
import { selectUser, selectProfile } from "../slices/authSlice";
import { selectHabits } from '../slices/habitSlice';
import { logout } from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import getHabits, {getTodayHabits, getDate, getHabitsFromDate, weekDays} from '../Api';
import Habit from '../components/Habit'
import * as Mui from '@mui/material';
import cup from '../images/water.png'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Drink from '@mui/icons-material/LocalDrink';
import Walk from '@mui/icons-material/DirectionsWalk';
import Custom from '@mui/icons-material/EmojiEvents';
import CustomDatePicker from './CustomDatePicker'
import moment from 'moment'
import HabitForm from './HabitForm';
import Add from '@mui/icons-material/AddCircleOutline';
import Minus from '@mui/icons-material/RemoveCircleOutline';
import { amber } from '@mui/material/colors';
import Star from '@mui/icons-material/Star';
import StarIcon from '@mui/icons-material/StarBorder';


const Home = () => {
    let navigate = useNavigate();
    const user = useSelector(selectUser);
    const profile = useSelector(selectProfile);
    const habits = useSelector(selectHabits)
    const uid = user.uid
    const api_token = user.api_token;
    const [date, setDate] = useState(getDate());
    const [value, setValue] = useState(getDate());


    const getFirstDate = (habits) => {
        if(habits==null){
            return getDate()
        }
        var dates = [];
        for(var habit of habits) {
            dates.push(habit.created)
        }
        return dates.sort()[0]
    }

    const repeatDays = (activeDays) => {
        var days = ""
        for(var day of weekDays){
          if(activeDays[day]){
            days = days + day + ", "
          }
        }
        days= days.slice(0, -2);
        return days
      }

    const rendericon = (category) => {
        switch(category){
            case 'Custom':
                return <Custom sx={{ fontSize: 40, color: '#ffc600'}} />
            case 'Drink':
                return <Drink sx={{ fontSize: 40, color: '#2acaea'}} />
            case 'Walk':
                return <Walk sx={{ fontSize: 40, color: '#B6134A'}} />

        }
    }

    const countCompleteFromDate = (date) =>
    {
        var completed=0;   
        var total=0;
        if(habits == null ) return undefined;
        for(var habit of habits){             
            if(habit.stats)
            {          
                if (habit.stats[date]){        //If today weekday is true
                    total=total+1;
                    completed=completed+habit.stats[date].completed;                
                } 
            }     
        }  
        return (total?completed/total:undefined);
    }
  
    const getDaysBetweenDates = (startDate, endDate) => {
        var now = startDate.clone(), dates = [];
        while (now.isSameOrBefore(endDate)) {
            dates.push(now.format('YYYY-MM-DD'));
            now.add(1, 'days');
        }
        return dates
    };
  
    const markDay = () =>
    {
        let dates=getDaysBetweenDates(moment(getFirstDate(habits)), new Date());
        var red=[]
        var yellow=[]
        var green=[]
        for (var k of dates){
              let progress=countCompleteFromDate(k);
              if (progress == undefined) continue;
              if(progress<0.5)
                  red.push(k);
              else
              { 
                  if(progress<1)
                      yellow.push(k)
                  else
                      green.push(k);
              }
            }    
         
        const x=[red,yellow,green]    
        return x;
    }

    var red=[]
    var yellow=[]
    var green=[]

    red=markDay()[0];
    yellow=markDay()[1];
    green=markDay()[2];

    var color;
  

    useEffect(async() => {   
        getHabits(uid,api_token,{})
        }, [])

   
    return (<>
        <div className="bar">
            <div className="header">
                <img src={user.photo_url} alt="" />
                <h1>Hello, <span></span>{user.fullname}</h1>
            </div>
            <Mui.Button style={{marginTop:-15}} onClick={() => {logout();  navigate('/')}}>Sign out</Mui.Button>
        </div>
        <div className='full-box'>
            <div className="left-box">
                <HabitForm />
            </div>


            <div className="center-box">
                <div className="date-picker">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            minDate={new Date(getFirstDate(habits))} 
                            maxDate={new Date()}
                            label="Insert day"
                            value={date}
                            onChange={(newDate) => {
                            setDate(newDate);
                            }}
                            renderInput={(params) => <Mui.TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>
                {habits?.map(habit => 
                    (getHabitsFromDate(habits, date)?.includes(habit.id) && (<>
                    <Mui.Card style={{marginBottom:10}} >
                        <Mui.Box sx={{ p: 2, display: 'flex', justifyContent:'space-between'}}>
                            <div style={{flexDirection:'row', display:'flex'}}>
                                <div>
                                {rendericon(habit.category)}
                                </div>
                                <div>
                                <Mui.Stack spacing={0.5} marginLeft='7%'>
                                    <Mui.Typography fontWeight={700}>{habit.name}</Mui.Typography>
                                    <Mui.Typography variant="body2" color="text.secondary">
                                    {(repeatDays(habit.repeat_days).split(',').length>6) ? 'Everyday':repeatDays(habit.repeat_days)}
                                    </Mui.Typography>
                                </Mui.Stack>
                                </div>
                            </div>
                            {/* <Mui.IconButton onPress={()=>console.log('edito')}>
                                <Edit />
                            </Mui.IconButton> */}
                            <div>
                                {habit.category!="Custom" ?(<>
                                <Mui.Typography textAlign='center' fontWeight={700}>{habit.value}/{habit.set_value}</Mui.Typography>
                                
                                <Add sx={{ fontSize: 25, color: habit.category=="Walk"?'#B6134A':'#2acaea'}} />
                                <Minus sx={{ fontSize: 25, color: habit.category=="Walk"?'#B6134A':'#2acaea'}} />
                                </>)
                                :
                                (<Mui.Checkbox checked={habit.stats[moment(date).format('YYYY-MM-DD')].completed} sx={{
                                    color: amber[800],
                                    '&.Mui-checked': {
                                      color: amber[400],
                                    }}} 
                                    icon={<StarIcon sx={{ fontSize: 30}}/>}
                                    checkedIcon={<Star sx={{ fontSize: 30}}/>}
                                    />)}
                            </div>
                        </Mui.Box>
                    </Mui.Card>
                    </>
                    )        
                    )
                    )}
            </div>
            <div className="right-box" >
                <div className="static-picker">
                    <CustomDatePicker red={red} yellow={yellow} green={green} first={getFirstDate(habits)}/>
                    <p style={{textAlign:'center', fontWeight:'bold', marginTop:-20}}>MONTHLY RECAP</p>
                </div>
            </div>
        </div>
    </>)
}

export default Home;