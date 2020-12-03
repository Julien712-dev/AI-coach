import { createSlice } from '@reduxjs/toolkit';
import * as firebase from 'firebase';

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        firstName: 'John',
        lastName: 'Doe',
        height: 170,
        heightUnit: 'cm',
        weight: 60,
        weightUnit: 'kg',
        sex: 'M',
        age: 18,
        bodyGoal: 'Weight Control',
        exerciseHabit: [],
        includeRunning: false,
        dietHabit: [],
        foodAllergies: [],
    },
    reducers: {
        updateTempStorage: (state, action) => {
            state = {...state, ...action.payload}
        }
    }
});

const { reducer, actions } = profileSlice;
export const { updateTempStorage } = actions;
export default reducer;