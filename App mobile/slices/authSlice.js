import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: {
        fullname: null,
        uid:null,
        api_token: null,
        photo_url: null
    },
    profile: {
        name: "pippo",        
        height: "173",
        rise_time: "07:30",
        sleep_time: "23:30",
        profile_complete:false
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
            state.profile = action.payload;
            //call api to update profile
        },  
             
    }
})

export const { setUser, setLoadingInit, setLoading, setProfile } = authSlice.actions;

export const selectUser = (state) => state.auth1.user;
export const selectLoadingInit = (state) => state.auth1.loadingInit;
export const selectLoading = (state) => state.auth1.loading;
export const selectProfile = (state) => state.auth1.profile;


export default authSlice.reducer;