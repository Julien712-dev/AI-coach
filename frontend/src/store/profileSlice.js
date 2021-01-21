import { createSlice } from '@reduxjs/toolkit';
import * as firebase from 'firebase';

const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        firstName: null,
        lastName: null,
        height: null,
        heightUnit: 'cm',
        weight: null,
        weightUnit: 'kg',
        sex: 'M',
        age: null,
        bodyGoal: null,
        exerciseHabit: '',
        dietHabit: [], // balanced diet, lose weight, build muscles
        dietRestrictions: [],
        foodAllergies: [],
    },
    reducers: {
        updateTempStorage: (state, action) => {
            return {...state, ...action.payload}
        },
        saveProfileToFirebase: (state, action) => {
            const userRef = action.payload;
            userRef.set({...state});
            // reset state values
            return {...state}
        },
        clearTempStorage: (state, action) => {
            return {
                firstName: null,
                lastName: null,
                height: null,
                heightUnit: 'cm',
                weight: null,
                weightUnit: 'kg',
                sex: 'M',
                age: null,
                bodyGoal: null,
                exerciseHabit: '',
                dietHabit: [], // balanced diet, lose weight, build muscles
                dietRestrictions: [],
                foodAllergies: [],
            }
        }
    }
});

const { reducer, actions } = profileSlice;
export const { updateTempStorage, saveProfileToFirebase, clearTempStorage } = actions;
export default reducer;