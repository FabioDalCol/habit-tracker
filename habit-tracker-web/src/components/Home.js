import React from 'react';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useSelector } from "react-redux";
import { selectUser, selectProfile } from "../slices/authSlice";
import { selectHabits } from '../slices/habitSlice';
import { logout } from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import getHabits, {getTodayHabits, getDate, getHabitsFromDate, weekDays, countCompletedHabits} from '../Api';
import * as Mui from '@mui/material';
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
import store from '../store';
import { incrementValue, decrementValue, setValue, triggerCompleted, pushValue, setIsActive } from '../slices/habitSlice';


const Home = () => {
    let navigate = useNavigate();
    const user = useSelector(selectUser);
    const profile = useSelector(selectProfile);
    const habits = useSelector(selectHabits)
    const uid = user.uid
    const api_token = user.api_token;
    const [date, setDate] = useState(getDate());
    const [val, setVal] = useState(10);

    var todayHabits = getTodayHabits(habits);
    var completedHabitsCount = countCompletedHabits(todayHabits,habits);  

    const dailyProgressColor = () => {   
        var percent=completedHabitsCount/todayHabits.length*100+"%" 
        if(completedHabitsCount/todayHabits.length<=1/3){
          return {backgroundColor: 'red', width: percent}
        }
        if(completedHabitsCount/todayHabits.length<=1/2){
          return {backgroundColor: 'orange', width: percent}
        }
        else{
          return {backgroundColor: 'green', width: percent}
        }
    }

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

    const handleChange = (event) => {
        setVal(event.target.value);
      };
  
    useEffect(async() => {   
        getHabits(uid,api_token,{})
        }, [])

   
    return (<>
        <div className="bar">
            <div className="header">
                <img src={user.photo_url} alt="" />
                <h1>Hello, <span></span>{profile.username}</h1>
            </div>
            <Mui.Button style={{marginTop:-15}} onClick={() => {logout();  navigate('/')}}>Sign out</Mui.Button>
        </div>
        <div className='full-box'>
            <div className="left-box">
                <HabitForm uid={uid} token={api_token} />
            </div>


            <div className="center-box">
                <div style={{justifyContent:'center', display:'flex'}}>
                    BARRA PROGRESSO
                </div> 
                {habits?.map(habit => 
                    (todayHabits?.includes(habit.id) && (<>
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
                                    <div style={{display:'flex', flexDirection:"row", alignItems:'center'}}>
                                    <div>
                                    <input
                                        type='text'
                                        style={{width:10+String(val).length*10, height:20, color:'#333333', borderRadius:90, fontWeight: 650, textAlign:'center', marginRight:2, borderColor:'white'}} 
                                        value={val}
                                        onChange={handleChange}
                                        size='small'
                                    />
                                    </div>
                                    <div>
                                    <Mui.Typography textAlign='center' fontWeight={700}>/{habit.set_value}</Mui.Typography>
                                    </div>
                                </div>
                                <div style={{textAlign: 'end'}}>
                                    <Mui.IconButton onClick={() => console.log('adssafas')} style={{marginRight:-10}}>
                                        <Add sx={{ fontSize: 25, color: habit.category=="Walk"?'#B6134A':'#2acaea'}}  />
                                    </Mui.IconButton>
                                    <Mui.IconButton onClick={() => console.log('adssafas')}>
                                        <Minus sx={{ fontSize: 25, color: habit.category=="Walk"?'#B6134A':'#2acaea'}} />
                                    </Mui.IconButton>
                                </div>
                                </>)
                                :
                                (<Mui.Checkbox checked={habit.stats[moment(date).format('YYYY-MM-DD')]?.completed} sx={{
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
                    <CustomDatePicker red={red} yellow={yellow} green={green} first={getFirstDate(habits)} setDateHome={setDate} />
                    {/* <p style={{textAlign:'center', fontWeight:600, fontSize:22}}>Habits for {date}</p> impazzisce se cambio data non so perchè */}
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
                                <div style={{display:'flex', flexDirection:"row", alignItems:'center'}}>
                                    <div>
                                    <input
                                        type='text'
                                        style={{width:10+String(val).length*10, height:20, color:'#333333', borderRadius:90, fontWeight: 650, textAlign:'center', marginRight:2, borderColor:'white'}} 
                                        value={val}
                                        onChange={handleChange}
                                        size='small'
                                    />
                                    </div>
                                    <div>
                                    <Mui.Typography textAlign='center' fontWeight={700}>/{habit.set_value}</Mui.Typography>
                                    </div>
                                </div>
                                <div style={{textAlign: 'end'}}>
                                    <Mui.IconButton onClick={() => console.log('adssafas')} style={{marginRight:-10}}>
                                        <Add sx={{ fontSize: 25, color: habit.category=="Walk"?'#B6134A':'#2acaea'}}  />
                                    </Mui.IconButton>
                                    <Mui.IconButton onClick={() => console.log('adssafas')}>
                                        <Minus sx={{ fontSize: 25, color: habit.category=="Walk"?'#B6134A':'#2acaea'}} />
                                    </Mui.IconButton>
                                </div>
                                </>)
                                :
                                (<Mui.Checkbox checked={habit.stats[moment(date).format('YYYY-MM-DD')]?.completed} sx={{
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
            </div>
        </div>
    </>)
}

export default Home;