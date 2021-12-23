import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: {
        fullname: null,
        uid:null,
        api_token: null,
        photo_url: null
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
    }
})

export const { setUser, setLoadingInit, setLoading } = authSlice.actions;

export const selectUser = (state) => state.auth1.user;
export const selectLoadingInit = (state) => state.auth1.loadingInit;
export const selectLoading = (state) => state.auth1.loading;


export default authSlice.reducer;