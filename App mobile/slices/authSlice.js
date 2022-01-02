import { createSlice } from '@reduxjs/toolkit';
import { updateProfile } from '../Api';

const initialState = {
    user: {
        fullname: "null",
        uid:"null",
        api_token: "null",
        photo_url: "null"
    },
    profile: {
        username: null,        
        height: null,
        age:null,
        rise_time: null,
        sleep_time: null,        
    },

    loadingInit: true,
    loading: false    
}

export const authSlice = createSlice({
    name: 'auth1',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoadingInit: (state, action) => {
            state.loadingInit = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setProfile: (state, action) => {
            state.profile = action.payload.profile;
            uid = action.payload.uid;
            token = action.payload.token;
            updateProfile(uid,token,state.profile)
        },  
             
    }
})

export const { setUser, setLoadingInit, setLoading, setProfile } = authSlice.actions;

export const selectUser = (state) => state.auth1.user;
export const selectLoadingInit = (state) => state.auth1.loadingInit;
export const selectLoading = (state) => state.auth1.loading;
export const selectProfile = (state) => state.auth1.profile;


export default authSlice.reducer;