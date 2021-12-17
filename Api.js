import React from 'react'
import axios from 'axios';
import store from './store';
import { setHabits} from './slices/habitSlice';
import { selectHabits } from './slices/habitSlice';
import { useSelector } from 'react-redux';


const getHabits = async (uid,token,old,setRefreshing) => {
    const baseUrl = `https://habits-app-api.ew.r.appspot.com/api/v1/users/`;    
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

export default getHabits