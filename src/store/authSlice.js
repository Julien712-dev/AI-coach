import { createSlice } from '@reduxjs/toolkit';
import * as firebase from 'firebase';

const authSlice = createSlice({
    name: 'counter',
    initialState: {
        user: null, // to store the session of the user. when null, user is required to log in
        profile: null
    },
    reducers: {
        login: {
            reducer: (state, action) => {state.user = action.payload.user},
            prepare: () => ({ payload: { user: firebase.auth().currentUser } })
        },
        logout: (state, action) => {return {...state, user: null}}
    }
});

const { reducer, actions } = authSlice;
export const { login, logout } = actions;
export default reducer;