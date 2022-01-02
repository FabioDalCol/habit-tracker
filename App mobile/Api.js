import axios from 'axios';
import store from './store';
import { setHabits} from './slices/habitSlice';

export const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const baseUrl = `https://habits-app-api.ew.r.appspot.com/api/v1/users/`;  

const getHabits = async (uid,token,old,setRefreshing) => {      
    const url = baseUrl + uid + '/habits/'    
    await axios.get(url,{headers:{token: token}})
    .then((response) => {             
        if (JSON.stringify(old) != JSON.stringify(response.data)){
            store.dispatch(setHabits(response.data));           
        }              
      })
    .catch(error => alert(error.message))
    .finally(()=>{if(setRefreshing != undefined) setRefreshing(false);});
};

const updateHabit = async (uid,token,habit,id) => {       
    const url = baseUrl + uid + '/habits/' + id;     
    await axios.put(url,habit,{headers:{token: token, 'Content-Type': 'application/json'}})    
    .catch(error =>{ alert(error.message)})
    .finally(() => getHabits(uid, token, {}));     
};

const addHabit = async (uid,token,habit,habits) => { 
    //console.log(habit);   
    const url = baseUrl + uid + '/habits/';       
    await axios.post(url,habit,{headers:{token: token, 'Content-Type': 'application/json'}})    
    .catch(error =>{ alert(error.message)})
    .finally(() => getHabits(uid, token, {})); 
    alert('Habit aggiunto!');   
};

const removeHabit = async (uid,token,id) => {      
    const url = baseUrl + uid + '/habits/' + id      
    await axios.delete(url,{headers:{token: token}})    
    .catch(error =>{ alert(error.message)})
    .finally(()=>
        getHabits(uid, token, {})
    )    
};

const getDate = () => {
    let today = new Date()
    return today.toISOString().split('T')[0]
}

const getTodayHabits = (habits) => {
    today = new Date ()
    var ids = []   
    if(habits == null ) return ids
    for(var habit of habits){             
        if (habit.repeat_days[weekDays[today.getDay()]] && habit.is_active){        //If today weekday is true
            ids.push(habit.id)
        }      
    }        
    return ids
}


const countCompletedHabits = (habIds,habits) => {
    var completed = 0;
    var today = getDate();    
    for(var id of habIds){
        const index = habits.findIndex( habit => habit.id == id);        
        if (habits[index].stats != undefined)            
            if (habits[index].stats[today]?.completed){                
                completed++;            
            }
    }  
    return completed;
}

const getProfile = async (uid,token,old,setRefreshing) => {      
    const url = baseUrl + uid;   
    await axios.get(url,{headers:{token: token}})
    .then((response) => {             
        if (JSON.stringify(old) != JSON.stringify(response.data)){
            store.dispatch(setHabits(response.data));           
        }              
      })
    .catch(error => alert(error.message))
    .finally(()=>{if(setRefreshing != undefined) setRefreshing(false);});
};

const updateProfile = async (uid,token,profile,id) => {       
    const url = baseUrl + uid;   
    await axios.put(url,profile,{headers:{token: token, 'Content-Type': 'application/json'}})    
    .catch(error =>{ alert(error.message)})
    .finally(() => getProfile(uid, token, {}));     
};


export default getHabits
export {updateHabit,getDate,addHabit,removeHabit,getTodayHabits,countCompletedHabits,updateProfile,getProfile}